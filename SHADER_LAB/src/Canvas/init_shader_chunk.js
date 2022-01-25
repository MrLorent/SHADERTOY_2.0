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

#define N_MATERIALS 8
#define N_RAY 5
uniform float uTime;
uniform vec3 uResolution;
uniform vec3 uCameraPosition;
uniform mat4 uCameraMatrix;

in vec2 vertex_uv;



`

shaderChunk['init_object_flat_painting']=`void init_object(){

    back_wall.a=vec3(14., 0., 7.);
    back_wall.b=vec3(-14., 0., 7.);
    back_wall.c=vec3(14., 14., 7.);
    back_wall.d=vec3(-14., 14., 7.);
    back_wall.mat.base_color=uColors[5];

    bottom_wall.a=vec3(-3., 0., 0.);
    bottom_wall.b=vec3(-3., 0., 7.);
    bottom_wall.c=vec3(3., 0., 0.);
    bottom_wall.d=vec3(3., 0., 7.);
    bottom_wall.mat.base_color=uColors[5];

    right_wall.a=vec3(3., 0., 0.);
    right_wall.b=vec3(3., 5., 0.);
    right_wall.c=vec3(3., 0., 7.);
    right_wall.d=vec3(3., 5., 7.);
    right_wall.mat.base_color=uColors[6];

    left_wall.a=vec3(-3., 0., 0.);
    left_wall.b=vec3(-3., 5., 0.);
    left_wall.c=vec3(-3., 0., 7.);
    left_wall.d=vec3(-3., 5., 7.);
    left_wall.mat.base_color=uColors[7];

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
    back_wall.a=vec3(14., 0., 7.);
    back_wall.b=vec3(-14., 0., 7.);
    back_wall.c=vec3(14., 14., 7.);
    back_wall.d=vec3(-14., 14., 7.);
    back_wall.mat.base_color=uColors[5];

    bottom_wall.a=vec3(-3., 0., 0.);
    bottom_wall.b=vec3(-3., 0., 7.);
    bottom_wall.c=vec3(3., 0., 0.);
    bottom_wall.d=vec3(3., 0., 7.);
    bottom_wall.mat.base_color=uColors[5];

    right_wall.a=vec3(3., 0., 0.);
    right_wall.b=vec3(3., 5., 0.);
    right_wall.c=vec3(3., 0., 7.);
    right_wall.d=vec3(3., 5., 7.);
    right_wall.mat.base_color=uColors[6];

    left_wall.a=vec3(-3., 0., 0.);
    left_wall.b=vec3(-3., 5., 0.);
    left_wall.c=vec3(-3., 0., 7.);
    left_wall.d=vec3(-3., 5., 7.);
    left_wall.mat.base_color=uColors[7];

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
    
    back_wall.a=vec3(14., 0., 7.);
    back_wall.b=vec3(-14., 0., 7.);
    back_wall.c=vec3(14., 14., 7.);
    back_wall.d=vec3(-14., 14., 7.);
    back_wall.mat.base_color=uColors[5];
    back_wall.mat.kd=uKd[5];

    bottom_wall.a=vec3(-3., 0., 0.);
    bottom_wall.b=vec3(-3., 0., 7.);
    bottom_wall.c=vec3(3., 0., 0.);
    bottom_wall.d=vec3(3., 0., 7.);
    bottom_wall.mat.base_color=uColors[5];
    bottom_wall.mat.kd=uKd[5];

    right_wall.a=vec3(3., 0., 0.);
    right_wall.b=vec3(3., 5., 0.);
    right_wall.c=vec3(3., 0., 7.);
    right_wall.d=vec3(3., 5., 7.);
    right_wall.mat.base_color=uColors[6];
    right_wall.mat.kd=uKd[6];

    left_wall.a=vec3(-3., 0., 0.);
    left_wall.b=vec3(-3., 5., 0.);
    left_wall.c=vec3(-3., 0., 7.);
    left_wall.d=vec3(-3., 5., 7.);
    left_wall.mat.base_color=uColors[7];
    left_wall.mat.kd=uKd[7];


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

shaderChunk['init_object_personal']=`
void init_object(){
    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);

    }else if(SCENE == 1){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;

        sphere2.origin=vec3(0,1,5);
        sphere2.radius=0.5;

        sphere3.origin=vec3(1,1,5);
        sphere3.radius=0.5;
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

    struct Quad{
        vec3 a,b,c,d;
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
    Quad back_wall, left_wall, right_wall, bottom_wall;

    
   
    
    
    float SphereSDF(in vec3 ray_intersect, in Sphere sphere) {
        return length(ray_intersect - sphere.origin) - sphere.radius;
    }
                                        
    float BoxSDF(in vec3 ray_intersect, in Box box ){
        vec3 q = abs(ray_intersect - box.origin) - box.dimension;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }
    
    float QuadSDF( vec3 p, Quad w){
        vec3 v1=w.a;
        vec3 v2=w.b;
        vec3 v3=w.c;
        vec3 v4=w.d;
        #if 1 //handle ill formed quads
        if( dot( cross( v2-v1, v4-v1 ), cross( v4-v3, v2-v3 )) < 0.0 ){
            vec3 tmp = v3;
            v3 = v4;
            v4 = tmp;
        }
        #endif

        vec3 v21 = v2 - v1; vec3 p1 = p - v1;
        vec3 v32 = v3 - v2; vec3 p2 = p - v2;
        vec3 v43 = v4 - v3; vec3 p3 = p - v3;
        vec3 v14 = v1 - v4; vec3 p4 = p - v4;

        vec3 nor = cross( v21, v14 );

        return sqrt( (sign(dot(cross(v21,nor),p1)) + 
                    sign(dot(cross(v32,nor),p2)) + 
                    sign(dot(cross(v43,nor),p3)) + 
                    sign(dot(cross(v14,nor),p4))<3.0) 
                    ?
                    min( min( dot2(v21*clamp(dot(v21,p1)/dot2(v21),0.0,1.0)-p1), 
                                dot2(v32*clamp(dot(v32,p2)/dot2(v32),0.0,1.0)-p2) ), 
                        min( dot2(v43*clamp(dot(v43,p3)/dot2(v43),0.0,1.0)-p3),
                                dot2(v14*clamp(dot(v14,p4)/dot2(v14),0.0,1.0)-p4) ))
                    :
                    dot(nor,p1)*dot(nor,p1)/dot2(nor) )- 0.001;
    }
    
    float SceneSDF(out Material hit_object, in vec3 ray_intersect) { // sdf for the scene.
        float sphere_dist = SphereSDF(ray_intersect, sphere1);  //Distance to our sphere
        float box_dist = BoxSDF(ray_intersect, box1);     //Distance to our box
        
        float nearest_object= min(sphere_dist, box_dist);

        float bottom_wall_dist= QuadSDF(ray_intersect, bottom_wall);
        float left_wall_dist= QuadSDF(ray_intersect, left_wall);
        float right_wall_dist= QuadSDF(ray_intersect, right_wall);
        float back_wall_dist= QuadSDF(ray_intersect, back_wall);

        float nearest_wall= min(bottom_wall_dist, left_wall_dist);
        nearest_wall= min(nearest_wall, right_wall_dist);
        nearest_wall= min(nearest_wall, back_wall_dist);

        float d = min(nearest_wall, nearest_object);

        if(d == sphere_dist){
            hit_object = sphere1.mat; 
        }else if(d == box_dist){
            hit_object = box1.mat; 
        }else if(d == bottom_wall_dist){
            hit_object = bottom_wall.mat;
        }else if(d == left_wall_dist){
            hit_object = left_wall.mat;
        }else if(d == right_wall_dist){
            hit_object = right_wall.mat;
        }else if(d == back_wall_dist){
            hit_object = back_wall.mat;
        }

        return d;

    }

    bool intersect(vec3 ray_origin,vec3 ray_position,vec3 ray_direction )
    {
        float sphereDist = SphereSDF(ray_position, sphere1);  //Distance to our sphere
        float boxDist = BoxSDF(ray_position, box1);     //Distance to our box
            
        float minDist= min(sphereDist, boxDist);
        float planeDist = ray_position.y; // ground

            
        float d = min(planeDist, minDist);
        if(d == planeDist){

            return false;
        }
        else{
            return true;
        }
    }
    `
shaderChunk['scene_preset_1']=`

    #define SCENE 1

    Sphere sphere1, sphere2, sphere3;
    Box box1, box2;
    Quad back_wall, left_wall, right_wall, bottom_wall;


    PointLight light = PointLight(vec3(0, 5, 6),
                                        vec3(0.600,0.478,0.478));
                                                                      
     
    float SphereSDF(in vec3 ray_intersect, in Sphere sphere) {
        return length(ray_intersect - sphere.origin) - sphere.radius;
    }

    float QuadSDF( vec3 p, Wall w){
        vec3 v1=w.a;
        vec3 v2=w.b;
        vec3 v3=w.c;
        vec3 v4=w.d;
        #if 1 //handle ill formed quads
        if( dot( cross( v2-v1, v4-v1 ), cross( v4-v3, v2-v3 )) < 0.0 ){
            vec3 tmp = v3;
            v3 = v4;
            v4 = tmp;
        }
        #endif

        vec3 v21 = v2 - v1; vec3 p1 = p - v1;
        vec3 v32 = v3 - v2; vec3 p2 = p - v2;
        vec3 v43 = v4 - v3; vec3 p3 = p - v3;
        vec3 v14 = v1 - v4; vec3 p4 = p - v4;

        vec3 nor = cross( v21, v14 );

        return sqrt( (sign(dot(cross(v21,nor),p1)) + 
                    sign(dot(cross(v32,nor),p2)) + 
                    sign(dot(cross(v43,nor),p3)) + 
                    sign(dot(cross(v14,nor),p4))<3.0) 
                    ?
                    min( min( dot2(v21*clamp(dot(v21,p1)/dot2(v21),0.0,1.0)-p1), 
                                dot2(v32*clamp(dot(v32,p2)/dot2(v32),0.0,1.0)-p2) ), 
                        min( dot2(v43*clamp(dot(v43,p3)/dot2(v43),0.0,1.0)-p3),
                                dot2(v14*clamp(dot(v14,p4)/dot2(v14),0.0,1.0)-p4) ))
                    :
                    dot(nor,p1)*dot(nor,p1)/dot2(nor) )-0.001;
    }
                                        
    float SceneSDF(out Material hit_object, in vec3 ray_intersect) { // sdf for the scene.
        Sphere neareast_sphere;
        float sphere_dist1 = SphereSDF(ray_intersect, sphere1);  //Distance to our sphere
        float sphere_dist2 = SphereSDF(ray_intersect, sphere2);  //Distance to our sphere
        float sphere_dist3 = SphereSDF(ray_intersect, sphere3);  //Distance to our sphere

        float nearest_object = min(sphere_dist1, sphere_dist2);
        nearest_object = min(nearest_object, sphere_dist3);

        float bottom_wall_dist= QuadSDF(ray_intersect, bottom_wall);
        float left_wall_dist= QuadSDF(ray_intersect, left_wall);
        float right_wall_dist= QuadSDF(ray_intersect, right_wall);
        float back_wall_dist= QuadSDF(ray_intersect, back_wall);

        float nearest_wall= min(bottom_wall_dist, left_wall_dist);
        nearest_wall= min(nearest_wall, right_wall_dist);
        nearest_wall= min(nearest_wall, back_wall_dist);

        float d = min(nearest_wall, nearest_object);

        if(d == sphere_dist1){
            hit_object = sphere1.mat;
        }else if(d == sphere_dist2){
            hit_object = sphere2.mat;
        }else if(d == sphere_dist3){
            hit_object = sphere3.mat;
        }else if(d == bottom_wall_dist){
            hit_object = bottom_wall.mat;
        }else if(d == left_wall_dist){
            hit_object = left_wall.mat;
        }else if(d == right_wall_dist){
            hit_object = right_wall.mat;
        }else if(d == back_wall_dist){
            hit_object = back_wall.mat;
        }

        return d;
    }

    bool intersect(vec3 ray_origin,vec3 ray_position,vec3 ray_direction )
    {
        float sphere1Dist = SphereSDF(ray_position, sphere1);  //Distance to our sphere
        float sphere2Dist = SphereSDF(ray_position, sphere2);  //Distance to our sphere
        float sphere3Dist = SphereSDF(ray_position, sphere3);  //Distance to our sphere
            
        float minDist = min(sphere1Dist, sphere2Dist);
        float minDist2 = min(minDist, sphere3Dist);
        float planeDist = ray_position.y; // ground

            
        float d = min(planeDist, minDist2);
        if(d == planeDist){

            return false;
        }
        else{
            return true;
        }
    }
    `
    
shaderChunk['RayMarch']=`
    float RayMarch(out Material hit_object, in vec3 ray_origin, in vec3 ray_direction) {
        float distance_from_origin = 0.; // Distance I've marched from origin
    
        for (int i = 0; i < MAX_MARCH_STEPS; i++) {
            vec3 ray_intersect = ray_origin + ray_direction * distance_from_origin;
            float distance_to_scene = SceneSDF(hit_object, ray_intersect);
            distance_from_origin += distance_to_scene;  // Safe distance to march with
            if (distance_from_origin > MAX_MARCH_DIST || // Far-plane clipping
                distance_to_scene < SURF_DIST_MARCH)  // Did we hit anything?
                break;
    }
    
    return distance_from_origin;
}   
`
    
shaderChunk['get_normal'] = `
    
vec3 get_normal(in vec3 ray_intersect) { // get surface normal using euler approx. method
      Material _;
      float d=SceneSDF(_,ray_intersect);
      vec2 e = vec2(.001, 0);
      vec3 n = d - vec3(
        SceneSDF(_,ray_intersect-e.xyy),
        SceneSDF(_, ray_intersect-e.yxy),
        SceneSDF(_, ray_intersect-e.yyx));
    
    return normalize(n);
}
    
    
`
    
shaderChunk['rand']=`
    
float rand(vec2 co){
     return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453)-0.5;
}
    
    
`  

shaderChunk['dot2']=`
float dot2(in vec3 v){
    return dot(v,v);
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
        vec3 ray_intersect = ray_origin + ray_direction * distance_to_object;

        color += Model_Illumination(ray_intersect, ray_origin, hit_object);
    }

   
	pc_fragColor = vec4(color/float(N_RAY), 1.0 );

    //pc_fragColor = vec4(color/float(N_RAY),1.0);

}
`



}
    
    