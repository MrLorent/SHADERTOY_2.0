#define MAX_MARCH_STEPS 128
#define MAX_MARCH_DIST 100.
#define SURF_DIST_MARCH .01
#define EULER_APPROX_OFFSET .003

#define N_BOXES 3
#define N_SPHERES 3
#define N_MATERIALS 2
#define N_RAY 5

uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uCameraPosition;

uniform mat4 uBoxInvMatrix[N_BOXES];
uniform mat4 uSphereInvMatrix[N_SPHERES];
uniform vec3 uColors[N_MATERIALS];
uniform vec4 uK[N_MATERIALS];


in vec3 fragCoord;
in vec2 vertex_uv;


//-----------------------------------------------------------------------------------------------------------------//

struct Sphere {
    vec3 origin;
    float radius;
};

struct Box{
    vec3 origin;
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


Sphere sphere = Sphere(vec3(-1,1, 8), 0.5);
Box box = Box(vec3(1, 1, 8), vec3(0.5));

PointLight light = PointLight(vec3(0, 5, 6),
                                    vec3(1.000,0.878,0.878));
                                                                                    

//---------------------------------------------------------------------------------------------------------------------



float SphereSDF(in vec3 ray_position, in Sphere sphere) {
    return length(ray_position - sphere.origin) - sphere.radius;
}

float BoxSDF(in vec3 ray_position, in Box box ){
  vec3 q = abs(ray_position - box.origin) - box.dimension;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float SceneSDF(out int hitObject, in vec3 ray_position) { // sdf for the scene.
    float sphereDist = SphereSDF(ray_position, sphere);  //Distance to our sphere
    float boxDist = BoxSDF(ray_position, box);     //Distance to our box
    
    float minDist= min(sphereDist, boxDist);
    float planeDist = ray_position.y; // ground
    
    float d = min(planeDist, minDist);
    hitObject = minDist == d ? 1 : 0;
    return d;
}

float RayMarch(out int hitObject, in vec3 ray_origin, in vec3 ray_direction) {
    float distance_from_origin = 0.; // Distance I've marched from origin

    for (int i = 0; i < MAX_MARCH_STEPS; i++) {
        vec3 ray_position = ray_origin + ray_direction * distance_from_origin;
        float distance_to_scene = SceneSDF(hitObject, ray_position);
        distance_from_origin += distance_to_scene;  // Safe distance to march with
        if (distance_from_origin > MAX_MARCH_DIST || // Far-plane clipping
            distance_to_scene < SURF_DIST_MARCH)  // Did we hit anything?
            break;
    }

    return distance_from_origin;
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

#define GetNormal GetNormalEulerTwoSided


vec3 flatPainting(in int hit_object){
    return uColors[hit_object];
}


float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453)-0.5;
}

void main()
{
    sphere.origin=vec3((mat4(uSphereInvMatrix[0])* vec4(-1,1, 8, 1)).xyz);
    box.origin=vec3((mat4(uBoxInvMatrix[0])* vec4(1,1, 8, 1)).xyz);
    vec2 uv = vertex_uv-0.5;
    uv*=uResolution.xy/uResolution.y;
    vec3 color=vec3(0);
    
    for(int i=0; i<N_RAY; i++){
        // simplest camera
        vec3 ray_origin = uCameraPosition;

        // Casting a ray in a random place for each pixels
        float offset = rand(vec2(i))/uResolution.y;
        vec3 ray_direction = normalize(vec3(uv.xy+offset, 1));


        // RayMarching stuff
        int hit_object;
        float distance_to_object = RayMarch(hit_object, ray_origin, ray_direction);

        color += flatPainting(hit_object);
    }

   
	pc_fragColor = clamp(vec4( pow(color/float(N_RAY), vec3(0.4545)), 1.0 ), 0.0, 1.0);//vec4(color/10.0, 1.0);

}