export default (shaderChunk) => {

shaderChunk['test_compile']=`#version 300 es
#define varying in
out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor`

shaderChunk['uniforms_and_defines']=`
#ifdef GL_ES
precision mediump float;
#endif
#define MAX_MARCH_STEPS 128
#define MAX_MARCH_DIST 100.
#define SURF_DIST_MARCH .001
#define EULER_APPROX_OFFSET .003

precision highp float;
precision highp int;

#define N_MATERIALS 6
#define N_RAY 5
uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uCameraPosition;
uniform mat4 uCameraMatrix;

in vec2 vertex_uv;



`
shaderChunk['init_object_flat_painting']=`
void init_object(){
    plane.mat.base_color=uColors[0];
    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[2];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color=uColors[1];

    }else if(SCENE == 1){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[1];

        sphere2.origin=vec3(0,1,5);
        sphere2.radius=0.5;
        sphere2.mat.base_color=uColors[2];

        sphere3.origin=vec3(1,1,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color=uColors[3];
    }
}`

shaderChunk['init_object_lambert']=`void init_object(){
    plane.mat.base_color=uColors[0];
    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[2];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color=uColors[1];

    }else if(SCENE == 1){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[1];

        sphere2.origin=vec3(0,1,5);
        sphere2.radius=0.5;
        sphere2.mat.base_color=uColors[2];

        sphere3.origin=vec3(1,1,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color=uColors[3];
    }
}
`
shaderChunk['init_object_phong']=`void init_object(){
    plane.mat.base_color= uColors[0];
    plane.mat.kd= uKd[0];
    plane.mat.ks= uKs[0];
    plane.mat.shininess= uShininess[0];

    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color= uColors[2];
        sphere1.mat.kd= uKd[2];
        sphere1.mat.ks= uKs[2];
        sphere1.mat.shininess= uShininess[2];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color= uColors[1];
        box1.mat.kd= uKd[1];
        box1.mat.ks= uKs[1];
        box1.mat.shininess= uShininess[1];

    }else if(SCENE == 1){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color= uColors[1];
        sphere1.mat.kd= uKd[1];
        sphere1.mat.ks= uKs[1];
        sphere1.mat.shininess= uShininess[1];

        sphere2.origin=vec3(0,1,5);
        sphere2.radius=0.5;
        sphere2.mat.base_color= uColors[2];
        sphere2.mat.kd= uKd[2];
        sphere2.mat.ks= uKs[2];
        sphere2.mat.shininess= uShininess[2];

        sphere3.origin=vec3(1,1,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color= uColors[3];
        sphere3.mat.kd= uKd[3];
        sphere3.mat.ks= uKs[3];
        sphere3.mat.shininess= uShininess[3];
    }
}`
shaderChunk['creation_object']=`
    struct Material{
        vec3 base_color;
        float ka;
        float kd;
        float ks;
        float shininess;
        float subsurface;
        float metallic;
        float specularTint;
        float roughness;
        float anisotropic;
        float sheen;
        float sheenTint;
        float clearcoat;
        float clearcoatGloss;
    };


    struct Sphere {
        vec3 origin;
        float radius;
        Material mat;
    };

    struct Box{
        vec3 origin;
        vec3 dimension; //{longueur, largeur, profondeur}
        Material mat;
    };

    struct Plane{
        Material mat;
    };

    struct PointLight {
        vec3 pos;
        vec3 col;
        vec3 vector;
    };`
    
shaderChunk['scene_preset_0']=`
    #define SCENE 0

    Sphere sphere1, sphere2, sphere3;
    Box box1, box2;
    Plane plane;
    
    // PointLight light = PointLight(vec3(0, -5, -6),
                                        // vec3(0.600,0.478,0.478));
                                                                      
    
    
    float SphereSDF(in vec3 ray_position, in Sphere sphere) {
        return length(ray_position - sphere.origin) - sphere.radius;
    }
                                        
    float BoxSDF(in vec3 ray_position, in Box box ){
        vec3 q = abs(ray_position - box.origin) - box.dimension;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }
    
    
    float SceneSDF(out Material hit_object, in vec3 ray_position) { // sdf for the scene.
        float sphereDist = SphereSDF(ray_position, sphere1);  //Distance to our sphere
        float boxDist = BoxSDF(ray_position, box1);     //Distance to our box
        
        float minDist= min(sphereDist, boxDist);
        float planeDist = ray_position.y; // ground
        
        float d = min(planeDist, minDist);
        if(d == planeDist){
            hit_object = plane.mat;
        }else if(d == sphereDist){
            hit_object = sphere1.mat;
        }else{
            hit_object = box1.mat;
        }
        return d;
    }
    `
shaderChunk['scene_preset_1']=`

    #define SCENE 1

    Sphere sphere1, sphere2, sphere3;
    Box box1, box2;
    Plane plane;

    PointLight light = PointLight(vec3(0, 5, 6),
                                        vec3(0.600,0.478,0.478));
                                                                      
     
    float SphereSDF(in vec3 ray_position, in Sphere sphere) {
        return length(ray_position - sphere.origin) - sphere.radius;
    }
                                        
    float SceneSDF(out Material hit_object, in vec3 ray_position) { // sdf for the scene.
        float sphereDist1 = SphereSDF(ray_position, sphere1);  //Distance to our sphere
        float sphereDist2 = SphereSDF(ray_position, sphere2);  //Distance to our sphere
        float sphereDist3 = SphereSDF(ray_position, sphere3);  //Distance to our sphere

        float minDist = min(sphereDist1, sphereDist2);
        float minDist2 = min(minDist, sphereDist3);
        float planeDist = ray_position.y; // ground
        
        float d = min(planeDist, minDist2);
        if(d == planeDist){
            hit_object = plane.mat;
        }else if(d == sphereDist1){
            hit_object = sphere1.mat;
        }else if(d == sphereDist2){
            hit_object = sphere2.mat;
        }else{
            hit_object = sphere3.mat;
        }

        return d;
    }
    `
    
shaderChunk['RayMarch']=`
    float RayMarch(out Material hit_object, in vec3 ray_origin, in vec3 ray_direction) {
        float distance_from_origin = 0.; // Distance I've marched from origin
    
        for (int i = 0; i < MAX_MARCH_STEPS; i++) {
            vec3 ray_position = ray_origin + ray_direction * distance_from_origin;
            float distance_to_scene = SceneSDF(hit_object, ray_position);
            distance_from_origin += distance_to_scene;  // Safe distance to march with
            if (distance_from_origin > MAX_MARCH_DIST || // Far-plane clipping
                distance_to_scene < SURF_DIST_MARCH)  // Did we hit anything?
                break;
    }
    
    return distance_from_origin;
}   
`
    
shaderChunk['get_normal'] = `
    
vec3 GetNormalEulerTwoSided(in vec3 p) { // get surface normal using euler approx. method
      Material _;
      float d=SceneSDF(_,p);
      vec2 e = vec2(.001, 0);
      vec3 n = d - vec3(
        SceneSDF(_,p-e.xyy),
        SceneSDF(_, p-e.yxy),
        SceneSDF(_, p-e.yyx));
    
    return normalize(n);
}
    
    
`
    
shaderChunk['rand']=`
    
float rand(vec2 co){
     return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453)-0.5;
}
    
    
`  

shaderChunk['intersect']=`
bool intersect(vec3 ray_origin,vec3 ray_position,vec3 ray_direction )
{
    float sphereDist = SphereSDF(ray_position, sphere1);  //Distance to our sphere
    float boxDist = BoxSDF(ray_position, box1);     //Distance to our box
        
    float minDist= min(sphereDist, boxDist);
    float planeDist = ray_position.y; // ground

        
    float d = min(planeDist, minDist);
    if(d == planeDist){

        return false;
    }else if(d == sphereDist){ 
        return true;
    }
    else{
        return true;
    }
}

`


shaderChunk['main']=`
void main()
{
    vec2 uv = vertex_uv-0.5;
    vec3 color=vec3(0);
    
    vec3 camRight   = vec3( uCameraMatrix[0][0],  uCameraMatrix[0][1],  uCameraMatrix[0][2]);
	vec3 camUp      = vec3( uCameraMatrix[1][0],  uCameraMatrix[1][1],  uCameraMatrix[1][2]);
    vec3 camForward = vec3(-uCameraMatrix[2][0], -uCameraMatrix[2][1], -uCameraMatrix[2][2]);
    
    init_object();

    for(int i=0; i<N_RAY; i++){
        // simplest camera
        vec3 ray_origin = uCameraPosition;

        // Casting a ray in a random place for each pixels
        float offset = rand(vec2(i))/uResolution.y;

        uv = vertex_uv+offset-0.5;
        uv*=uResolution.xy/uResolution.y;

        vec3 ray_direction = normalize(uv.x*camRight+uv.y*camUp+camForward);

        // RayMarching stuff
        Material hit_object;
        float distance_to_object = RayMarch(hit_object, ray_origin, ray_direction);
        vec3 ray_position = ray_origin + ray_direction * distance_to_object;

        color += Model_Illumination(ray_position, ray_origin, hit_object);

    }

   
	pc_fragColor = vec4(color/float(N_RAY), 1.0 );

    //pc_fragColor = vec4(color/float(N_RAY),1.0);

}
`



}
    
    