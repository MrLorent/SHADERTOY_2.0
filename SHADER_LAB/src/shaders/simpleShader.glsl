/// Possible things one could add to this:
/// * Rays should attenuate the further away they get from the camera.


// Based on what I read from: https://paroj.github.io/gltut/Illumination/Tut11%20BlinnPhong%20Model.html

//  Apparently, Blinn's model needs material.alpha to be higher than Phong's model
// to create the same effect. I concluded this by comparing this with the one which
// this shader is forked from

// Colors should be in standard rgb format: 0. < rgb < 1.

//#define MAX_MARCH_STEPS (1<<7)
#define MAX_MARCH_STEPS 128
#define MAX_MARCH_DIST 100.
#define SURF_DIST_MARCH .01
#define EULER_APPROX_OFFSET .003

#define N_BOXES 3
#define N_SPHERES 3
#define N_MATERIALS 2

uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uCameraPosition;

uniform mat4 uBoxInvMatrix[N_BOXES];
uniform mat4 uSphereInvMatrix[N_SPHERES];
uniform vec3 uColors[N_MATERIALS];
uniform vec4 uK[N_MATERIALS];


in vec3 fragCoord;
in vec2 vuv;

//-----------------------------------------------------------------------------------------------------------------//

struct Sphere {
    vec3 o;
    float r;
};

struct Box{
    vec3 o;
    vec3 dimension; //{longueur, largeur, profondeur}
};

struct PhongMaterial {
    vec3 albedo;
    float ks, kd, ka, alpha;
};

struct PointLight {
    vec3 pos;
    vec3 col;
};


Sphere s = Sphere(vec3(-1,1, 8), 0.5);
Box box = Box(vec3(1, 1, 8), vec3(0.5));

PointLight light = PointLight(vec3(0, 5, 6),
                                    vec3(1.000,0.878,0.878));
                                                                                    

//---------------------------------------------------------------------------------------------------------------------



float SphereSDF(in vec3 p, in Sphere s) {
    return length(p - s.o) - s.r;
}

float BoxSDF(in vec3 p, in Box b ){
  vec3 q = abs(p-b.o) - b.dimension;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float SceneSDF(out int hitObject, in vec3 p) { // sdf for the scene.
    float sphereDist = SphereSDF(p, s);  
    float boxDist = BoxSDF(p, box);
    
    float minDist= min(sphereDist, boxDist);
    float planeDist = p.y; // ground
    
    float d = min(planeDist, minDist);
    hitObject = minDist == d ? 1 : 0;
    return d;
}

float RayMarch(out int hitObject, in vec3 ro, in vec3 rd) {
    float dO = 0.; // Distance I've marched from origin

    for (int i = 0; i < MAX_MARCH_STEPS; i++) {
        vec3 p = ro + rd * dO;
        float dS = SceneSDF(hitObject, p);
        dO += dS;  // Safe distance to march with
        if (dO > MAX_MARCH_DIST || // Far-plane clipping
            dS < SURF_DIST_MARCH)  // Did we hit anything?
            break;
    }

    return dO;
}


vec3 GetNormalEulerTwoSided(in vec3 p) { // get surface normal using euler approx. method
    vec2 e = vec2(EULER_APPROX_OFFSET, 0);
    int _;
    
    vec3 left = vec3(SceneSDF(_, p),
                     SceneSDF(_, p - e.yxy),
                     SceneSDF(_, p - e.yyx)),
        right = vec3(SceneSDF(_, p + e.xyy),
                     SceneSDF(_, p + e.yxy),
                     SceneSDF(_, p + e.yyx));
        
    vec3 n = normalize(-left + right);
    return n;
}


/*vec3 GetNormalEulerOneSided(in vec3 p) { // get surface normal using euler approx. method
    vec2 e = vec2(EULER_APPROX_OFFSET, 0);
    int _;
    vec3 center = vec3(SceneSDF(_, p)),
          right = vec3(SceneSDF(_, p + e.xyy),
                       SceneSDF(_, p + e.yxy),
                       SceneSDF(_, p + e.yyx));
        
    vec3 n = normalize(right - center);
    return n;
}*/

//#define GetNormal GetNormalEulerOneSided
#define GetNormal GetNormalEulerTwoSided


/*
  p  -> position of point to shade
  ro -> ray origin (position of the camera)
*/
vec3 PhongIllumination(in vec3 p, in vec3 ro, in int hitObject) {
    vec3 lightPosOffset = vec3(sin(2. * uTime), 0, cos(2. * uTime)) * 3.;
    vec3 lightPos = light.pos + lightPosOffset;
    // PhongMaterial mat = (hitObject == 1) ? sphereMaterial : globalMaterial; // bugs are great!
    
    vec3 l = normalize(lightPos - p); // light vector
    vec3 n = GetNormal(p); // get normal of p
    vec3 r = reflect(l, n);
    vec3 v = normalize(ro - p);
    
    vec3 h = normalize(l + v); // the `half-angle` vector
    
    float dif  = clamp(dot(l, n), 0., 1.);
    float spec = clamp(dot(h, n), 0., 1.);  // also called `blinn term`
    
    // shadow stuff
    vec3 pOffset = n * SURF_DIST_MARCH * 1.2; // move the point above a little
    int _;
    float d = RayMarch(_, p + pOffset, l);
    if (d < length(lightPos - p)) { // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        dif *= .3; // no half-shadow because the light source is a point.    
        spec = 0.; // shadows don't have specular component, I think.
    }
    
    // Acutal Phong stuff
    vec3 ambientDiffuse = light.col * uColors[hitObject];
    vec3 light1DiffuseComponent = dif * light.col;
    vec3 light1SpecularComponent = vec3(pow(spec, uK[hitObject][3]));
    
    vec3 col = uK[hitObject][0] * ambientDiffuse + 
               uK[hitObject][1] * light1DiffuseComponent + 
               uK[hitObject][2] * light1SpecularComponent;
    
    return col;
}

vec3 flatPainting(in int hitObject){
    return uColors[hitObject];
}

vec3 Lambert(in vec3 p, in int hitObject){
    vec3 lightPosOffset = vec3(sin(2. * uTime), 0, cos(2. * uTime)) * 3.;
    vec3 lightPos = light.pos + lightPosOffset;
    
    vec3 l = normalize(lightPos - p); // light vector
    vec3 n = GetNormal(p); // get normal of p
    float dif  = clamp(dot(l, n), 0., 1.);
    
    return dif * uColors[hitObject] * light.col;
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453)-0.5;
}

void main()
{
    s.o=vec3((mat4(uSphereInvMatrix[0])* vec4(-1,1, 8, 1)).xyz);
    box.o=vec3((mat4(uBoxInvMatrix[0])* vec4(1,1, 8, 1)).xyz);
    vec2 uv = vuv-0.5;//(gl_FragCoord.xy - uResolution.xy * .5 ) / uResolution.y; // center around origin
    vec3 color=vec3(0);
    
    for(int i=0; i<5; i++){
        // simplest camera
        vec3 ro = uCameraPosition;//vec3(0,1,0);//vec3( uCameraMatrix[3][0],  uCameraMatrix[3][1],  uCameraMatrix[3][2]);
        float offset = rand(vec2(i))/uResolution.y;

        vec3 rd = normalize(vec3(uv.xy+offset, 1));


        // RayMarching stuff
        int object;
        float d = RayMarch(object, ro, rd);
        vec3 p = ro + rd * d;

        color += PhongIllumination(p, ro, object);
        //color += flatPainting(object);
        //color+=Lambert(p, object);
    }

   
	pc_fragColor = clamp(vec4( pow(color/5.0, vec3(0.4545)), 1.0 ), 0.0, 1.0);//vec4(color/10.0, 1.0);

}