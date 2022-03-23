export default (shaderChunk) => {
  shaderChunk['test_compile'] = `#version 300 es
#define varying in
out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor`

  shaderChunk['uniforms_and_defines'] = `
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

  shaderChunk['init_object_flat_painting'] = `void set_objects(){}
void init_object(){

    back_wall.a=vec3(3., 0., 9.);
    back_wall.b=vec3(-3., 0., 9.);
    back_wall.c=vec3(3., 5., 9.);
    back_wall.d=vec3(-3., 5., 9.);
    back_wall.mat.base_color=uColors[4];

    bottom_wall.a=vec3(-3., 0., -9.);
    bottom_wall.b=vec3(-3., 0., 9.);
    bottom_wall.c=vec3(3., 0., -9.);
    bottom_wall.d=vec3(3., 0., 9.);
    bottom_wall.mat.base_color=uColors[5];

    top_wall.a=vec3(-3., 5., -9.);
    top_wall.b=vec3(-3., 5., 9.);
    top_wall.c=vec3(3., 5., -9.);
    top_wall.d=vec3(3., 5., 9.);
    top_wall.mat.base_color=uColors[5];

    right_wall.a=vec3(3., 0., -9.);
    right_wall.b=vec3(3., 5., -9.);
    right_wall.c=vec3(3., 0., 9);
    right_wall.d=vec3(3., 5., 9.);
    right_wall.mat.base_color=uColors[6];

    left_wall.a=vec3(-3., 0., -9.);
    left_wall.b=vec3(-3., 5., -9.);
    left_wall.c=vec3(-3., 0., 9.);
    left_wall.d=vec3(-3., 5., 9.);
    left_wall.mat.base_color=uColors[7];

    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[1];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color=uColors[0];

    }else if(SCENE == 1){
        sphere1.origin = vec3(1,0.8,4.5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[0];

        sphere2.origin = vec3(0.5,1.5,6);
        sphere2.radius = 1.;
        sphere2.mat.base_color=uColors[1];

        sphere3.origin = vec3(-1,1.2,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color=uColors[2];
    }
}`

  shaderChunk['init_object_lambert'] = `void set_objects(){}
void init_object(){
    back_wall.a=vec3(3., 0., 9.);
    back_wall.b=vec3(-3., 0., 9.);
    back_wall.c=vec3(3., 5., 9.);
    back_wall.d=vec3(-3., 5., 9.);
    back_wall.mat.base_color=uColors[4];

    bottom_wall.a=vec3(-3., 0., -9.);
    bottom_wall.b=vec3(-3., 0., 9.);
    bottom_wall.c=vec3(3., 0., -9.);
    bottom_wall.d=vec3(3., 0., 9.);
    bottom_wall.mat.base_color=uColors[5];

    top_wall.a=vec3(-3., 5., -9.);
    top_wall.b=vec3(-3., 5., 9.);
    top_wall.c=vec3(3., 5., -9.);
    top_wall.d=vec3(3., 5., 9.);
    top_wall.mat.base_color=uColors[5];

    right_wall.a=vec3(3., 0., -9.);
    right_wall.b=vec3(3., 5., -9.);
    right_wall.c=vec3(3., 0., 9.);
    right_wall.d=vec3(3., 5., 9.);
    right_wall.mat.base_color=uColors[6];

    left_wall.a=vec3(-3., 0., -9.);
    left_wall.b=vec3(-3., 5., -9.);
    left_wall.c=vec3(-3., 0., 9.);
    left_wall.d=vec3(-3., 5., 9.);
    left_wall.mat.base_color=uColors[7];

    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[1];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color=uColors[0];

    }else if(SCENE == 1){
        sphere1.origin = vec3(1,0.8,4.5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[0];

        sphere2.origin = vec3(0.5,1.5,6);
        sphere2.radius = 1.;
        sphere2.mat.base_color=uColors[1];

        sphere3.origin=vec3(-1,1.2,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color=uColors[2];

        
        
        
    }
}
`
  shaderChunk['init_object_phong'] = `void set_objects(){}
void init_object(){
    
    back_wall.a=vec3(3., 0., 9.);
    back_wall.b=vec3(-3., 0., 9.);
    back_wall.c=vec3(3., 5., 9.);
    back_wall.d=vec3(-3., 5., 9.);
    back_wall.mat.base_color=uColors[4];
    back_wall.mat.kd=uKd[5];

    bottom_wall.a=vec3(-3., 0., -9.);
    bottom_wall.b=vec3(-3., 0., 9.);
    bottom_wall.c=vec3(3., 0., -9.);
    bottom_wall.d=vec3(3., 0., 9.);
    bottom_wall.mat.base_color=uColors[5];
    bottom_wall.mat.kd=uKd[5];

    top_wall.a=vec3(-3., 5., -9.);
    top_wall.b=vec3(-3., 5., 9.);
    top_wall.c=vec3(3., 5., -9.);
    top_wall.d=vec3(3., 5., 9.);
    top_wall.mat.base_color=uColors[5];
    top_wall.mat.kd=uKd[5];


    right_wall.a=vec3(3., 0., -9.);
    right_wall.b=vec3(3., 5., -9.);
    right_wall.c=vec3(3., 0., 9.);
    right_wall.d=vec3(3., 5., 9.);
    right_wall.mat.base_color=uColors[6];
    right_wall.mat.kd=uKd[6];

    left_wall.a=vec3(-3., 0., -9.);
    left_wall.b=vec3(-3., 5., -9.);
    left_wall.c=vec3(-3., 0., 9.);
    left_wall.d=vec3(-3., 5., 9.);
    left_wall.mat.base_color=uColors[7];


    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color= uColors[1];
        sphere1.mat.kd= uKd[1];
        sphere1.mat.ks= uKs[1];
        sphere1.mat.shininess= uShininess[1];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color= uColors[0];
        box1.mat.kd= uKd[0];
        box1.mat.ks= uKs[0];
        box1.mat.shininess= uShininess[0];

    }else if(SCENE == 1){
        sphere1.origin = vec3(1,0.8,4.5);;
        sphere1.radius=0.5;
        sphere1.mat.base_color= uColors[0];
        sphere1.mat.kd= uKd[0];
        sphere1.mat.ks= uKs[0];
        sphere1.mat.shininess= uShininess[0];

        sphere2.origin = vec3(0.5,1.5,6);
        sphere2.radius=1.;
        sphere2.mat.base_color= uColors[1];
        sphere2.mat.kd= uKd[1];
        sphere2.mat.ks= uKs[1];
        sphere2.mat.shininess= uShininess[1];

        sphere3.origin = vec3(-1,1.2,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color= uColors[2];
        sphere3.mat.kd= uKd[2];
        sphere3.mat.ks= uKs[2];
        sphere3.mat.shininess= uShininess[2];
    }
}`

  shaderChunk['init_object_cook_torrance'] = `void set_objects(){}
void init_object(){

    back_wall.a=vec3(3., 0., 9.);
    back_wall.b=vec3(-3., 0., 9.);
    back_wall.c=vec3(3., 5., 9.);
    back_wall.d=vec3(-3., 5., 9.);
    back_wall.mat.base_color=uColors[4];

    bottom_wall.a=vec3(-3., 0., -9.);
    bottom_wall.b=vec3(-3., 0., 9.);
    bottom_wall.c=vec3(3., 0., -9.);
    bottom_wall.d=vec3(3., 0., 9.);
    bottom_wall.mat.base_color=uColors[5];

    top_wall.a=vec3(-3., 5., -9.);
    top_wall.b=vec3(-3., 5., 9.);
    top_wall.c=vec3(3., 5., -9.);
    top_wall.d=vec3(3., 5., 9.);
    top_wall.mat.base_color=uColors[5];

    right_wall.a=vec3(3., 0., -9.);
    right_wall.b=vec3(3., 5., -9.);
    right_wall.c=vec3(3., 0., 9);
    right_wall.d=vec3(3., 5., 9.);
    right_wall.mat.base_color=uColors[6];

    left_wall.a=vec3(-3., 0., -9.);
    left_wall.b=vec3(-3., 5., -9.);
    left_wall.c=vec3(-3., 0., 9.);
    left_wall.d=vec3(-3., 5., 9.);
    left_wall.mat.base_color=uColors[7];

    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[1];
        sphere1.mat.roughness=uRoughness[1];

        box1.origin=vec3(1,1,5);
        box1.dimension=vec3(0.5);
        box1.mat.base_color=uColors[0];
        box1.mat.roughness=uRoughness[0];

    }else if(SCENE == 1){
        sphere1.origin = vec3(1,0.8,4.5);
        sphere1.radius=0.5;
        sphere1.mat.base_color=uColors[0];
        sphere1.mat.roughness=uRoughness[0];

        sphere2.origin = vec3(0.5,1.5,6);
        sphere2.radius = 1.;
        sphere2.mat.base_color=uColors[1];
        sphere2.mat.roughness=uRoughness[1];

        sphere3.origin = vec3(-1,1.2,5);
        sphere3.radius=0.5;
        sphere3.mat.base_color=uColors[2];
        sphere3.mat.roughness=uRoughness[2];
    }
}`


  shaderChunk['init_object_personal'] = `
void init_object(){
    back_wall.a=vec3(3., 0., 9.);
    back_wall.b=vec3(-3., 0., 9.);
    back_wall.c=vec3(3., 5., 9.);
    back_wall.d=vec3(-3., 5., 9.);
    back_wall.mat.base_color=vec3(253.0/255., 245.0/255., 240.0/255.);

    bottom_wall.a=vec3(-3., 0., -9.);
    bottom_wall.b=vec3(-3., 0., 9.);
    bottom_wall.c=vec3(3., 0., -9.);
    bottom_wall.d=vec3(3., 0., 9.);
    bottom_wall.mat.base_color=vec3(1,1.,1.);

    top_wall.a=vec3(-3., 5., -9.);
    top_wall.b=vec3(-3., 5., 9.);
    top_wall.c=vec3(3., 5., -9.);
    top_wall.d=vec3(3., 5., 9.);
    top_wall.mat.base_color=vec3(1.,1.,1.);

    right_wall.a=vec3(3., 0., -9.);
    right_wall.b=vec3(3., 5., -9.);
    right_wall.c=vec3(3., 0., 9.);
    right_wall.d=vec3(3., 5., 9.);
    right_wall.mat.base_color=vec3(227.0/255., 108.0/255., 68.0/255.);

    left_wall.a=vec3(-3., 0., -9.);
    left_wall.b=vec3(-3., 5., -9.);
    left_wall.c=vec3(-3., 0., 9.);
    left_wall.d=vec3(-3., 5., 9.);
    left_wall.mat.base_color=vec3(138.0/255., 184.0/255., 165.0/255.);

    if(SCENE == 0){
        sphere1.origin=vec3(-1,1,6);
        sphere1.radius=0.5;

        box1.origin=vec3(1,1,6);
        box1.dimension=vec3(0.5);

    }else if(SCENE == 1){
        sphere1.origin = vec3(1,0.8,4.5);
        sphere1.radius=0.5;

        sphere2.origin = vec3(0.5,1.5,6);
        sphere2.radius = 1.;

        sphere3.origin = vec3(-1,1.2,5);
        sphere3.radius=0.5;
    }
}`
  shaderChunk['creation_object'] = `
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

  shaderChunk['scene_preset_0'] = `
    #define SCENE 0

    Sphere sphere1, sphere2, sphere3;
    Box box1, box2;
    Quad back_wall, left_wall, right_wall, bottom_wall, top_wall;

    
   
    
    
    float SphereSDF(in vec3 ray_intersect, in Sphere sphere) {
        return length(ray_intersect - sphere.origin) - sphere.radius;
    }
                                        
    float BoxSDF(in vec3 ray_intersect, in Box box ){
        vec3 q = abs(ray_intersect - box.origin) - box.dimension;
        return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
    }
    
    float QuadSDF(in vec3 p, in Quad w){
        #if 1 //handle ill formed quads
        if( dot( cross( w.b-w.a, w.d-w.a ), cross( w.d-w.c, w.b-w.c )) < 0.0 ){
            vec3 tmp = w.c;
            w.c = w.d;
            w.d = tmp;
        }
        #endif

        vec3 v1 = w.b - w.a; vec3 p1 = p - w.a;
        vec3 v2 = w.c - w.b; vec3 p2 = p - w.b;
        vec3 v3 = w.d - w.c; vec3 p3 = p - w.c;
        vec3 v4 = w.a - w.d; vec3 p4 = p - w.d;

        vec3 nor = cross( v1, v4 );

        return sqrt( (sign(dot(cross(v1,nor),p1)) + 
                    sign(dot(cross(v2,nor),p2)) + 
                    sign(dot(cross(v3,nor),p3)) + 
                    sign(dot(cross(v4,nor),p4))<3.0) 
                    ?
                    min( min( dot2(v1*clamp(dot(v1,p1)/dot2(v1),0.0,1.0)-p1), 
                                dot2(v2*clamp(dot(v2,p2)/dot2(v2),0.0,1.0)-p2) ), 
                        min( dot2(v3*clamp(dot(v3,p3)/dot2(v3),0.0,1.0)-p3),
                                dot2(v4*clamp(dot(v4,p4)/dot2(v4),0.0,1.0)-p4) ))
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
        float top_wall_dist= QuadSDF(ray_intersect, top_wall);
        

        float nearest_wall= min(bottom_wall_dist, left_wall_dist);
        nearest_wall= min(nearest_wall, right_wall_dist);
        nearest_wall= min(nearest_wall, back_wall_dist);
        nearest_wall= min(nearest_wall, top_wall_dist);

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
        }else if(d == top_wall_dist){
            hit_object = top_wall.mat;
        }

        return d;

    }

    bool intersect(in vec3 ray_origin, in vec3 ray_intersect, in vec3 ray_direction )
    {
        float sphere_dist = SphereSDF(ray_intersect, sphere1);  //Distance to our sphere
        float box_dist = BoxSDF(ray_intersect, box1);     //Distance to our box
        
        float nearest_object= min(sphere_dist, box_dist);

        float bottom_wall_dist= QuadSDF(ray_intersect, bottom_wall);
        float left_wall_dist= QuadSDF(ray_intersect, left_wall);
        float right_wall_dist= QuadSDF(ray_intersect, right_wall);
        float back_wall_dist= QuadSDF(ray_intersect, back_wall);
        float top_wall_dist= QuadSDF(ray_intersect, top_wall);

        float nearest_wall= min(bottom_wall_dist, left_wall_dist);
        nearest_wall= min(nearest_wall, right_wall_dist);
        nearest_wall= min(nearest_wall, back_wall_dist);
        nearest_wall= min(nearest_wall, top_wall_dist);

        return (min(nearest_wall,nearest_object) == nearest_object);
    }
    `
  shaderChunk['scene_preset_1'] = `

    #define SCENE 1

    Sphere sphere1, sphere2, sphere3;
    Box box1, box2;
    Quad back_wall, left_wall, right_wall, bottom_wall, top_wall;
                                                                      
     
    float SphereSDF(in vec3 ray_intersect, in Sphere sphere) {
        return length(ray_intersect - sphere.origin) - sphere.radius;
    }

    float QuadSDF(in vec3 p, in Quad w){
        #if 1 //handle ill formed quads
        if( dot( cross( w.b-w.a, w.d-w.a ), cross( w.d-w.c, w.b-w.c )) < 0.0 ){
            vec3 tmp = w.c;
            w.c = w.d;
            w.d = tmp;
        }
        #endif

        vec3 v1 = w.b - w.a; vec3 p1 = p - w.a;
        vec3 v2 = w.c - w.b; vec3 p2 = p - w.b;
        vec3 v3 = w.d - w.c; vec3 p3 = p - w.c;
        vec3 v4 = w.a - w.d; vec3 p4 = p - w.d;

        vec3 nor = cross( v1, v4 );

        return sqrt( (sign(dot(cross(v1,nor),p1)) + 
                    sign(dot(cross(v2,nor),p2)) + 
                    sign(dot(cross(v3,nor),p3)) + 
                    sign(dot(cross(v4,nor),p4))<3.0) 
                    ?
                    min( min( dot2(v1*clamp(dot(v1,p1)/dot2(v1),0.0,1.0)-p1), 
                                dot2(v2*clamp(dot(v2,p2)/dot2(v2),0.0,1.0)-p2) ), 
                        min( dot2(v3*clamp(dot(v3,p3)/dot2(v3),0.0,1.0)-p3),
                                dot2(v4*clamp(dot(v4,p4)/dot2(v4),0.0,1.0)-p4) ))
                    :
                    dot(nor,p1)*dot(nor,p1)/dot2(nor) )-0.001;
    }
                                        
    float SceneSDF(out Material hit_object, in vec3 ray_intersect) { // sdf for the scene.
        float sphere_dist1 = SphereSDF(ray_intersect, sphere1);  //Distance to our sphere
        float sphere_dist2 = SphereSDF(ray_intersect, sphere2);  //Distance to our sphere
        float sphere_dist3 = SphereSDF(ray_intersect, sphere3);  //Distance to our sphere

        float nearest_object = min(sphere_dist1, sphere_dist2);
        nearest_object = min(nearest_object, sphere_dist3);

        float bottom_wall_dist= QuadSDF(ray_intersect, bottom_wall);
        float left_wall_dist= QuadSDF(ray_intersect, left_wall);
        float right_wall_dist= QuadSDF(ray_intersect, right_wall);
        float back_wall_dist= QuadSDF(ray_intersect, back_wall);
        float top_wall_dist= QuadSDF(ray_intersect, top_wall);


        float nearest_wall= min(bottom_wall_dist, left_wall_dist);
        nearest_wall= min(nearest_wall, right_wall_dist);
        nearest_wall= min(nearest_wall, back_wall_dist);
        nearest_wall= min(nearest_wall, top_wall_dist);

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
        }else if(d == top_wall_dist){
            hit_object = top_wall.mat;
        }

        return d;
    }

    bool intersect(in vec3 ray_origin, in vec3 ray_intersect, in vec3 ray_direction )
    {
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
        float top_wall_dist= QuadSDF(ray_intersect, top_wall);

        float nearest_wall= min(bottom_wall_dist, left_wall_dist);
        nearest_wall= min(nearest_wall, right_wall_dist);
        nearest_wall= min(nearest_wall, back_wall_dist);
        nearest_wall= min(nearest_wall, top_wall_dist);

        return (min(nearest_wall, nearest_object) == nearest_object);
    }
    `

  shaderChunk['RayMarch'] = `
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

  shaderChunk['rand'] = `
    
float rand(in vec2 co){
     return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453)-0.5;
}
    
    
`

  shaderChunk['dot2'] = `
float dot2(in vec3 v){
    return dot(v,v);
}

`

  shaderChunk['main'] = `

void main()
{
    vec2 uv = vertex_uv-0.5;
    vec3 color=vec3(0);
    
    vec3 camRight   = vec3( uCameraMatrix[0][0],  uCameraMatrix[0][1],  uCameraMatrix[0][2]);
	vec3 camUp      = vec3( uCameraMatrix[1][0],  uCameraMatrix[1][1],  uCameraMatrix[1][2]);
    vec3 camForward = vec3(-uCameraMatrix[2][0], -uCameraMatrix[2][1], -uCameraMatrix[2][2]);

    //vec3 SpherePosOffset = vec3(cos(uTime), 0, sin(uTime))/150.;
    vec3 SpherePosOffset = vec3(cos(uTime), 0,sin(uTime))/150.;


    
    init_object();
    set_objects();

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
