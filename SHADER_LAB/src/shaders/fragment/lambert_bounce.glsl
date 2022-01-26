#include <uniforms_and_defines>


/// color_picker scene uColors color
/// checkbox light uRotatingLight rotate_light 
/// color_picker light uColorLight color_light
/// slider light uLightPositionX positionX_light -50 50 0.1
/// slider light uLightPositionY positionY_light 1 50 0.1
/// slider light uLightPositionZ positionZ_light -50 50 0.1

/// color_picker light uColorLight2 color_light2
/// slider light uLightPositionX2 positionX_light2 -50 50 0.1
/// slider light uLightPositionY2 positionY_light2 1 50 0.1
/// slider light uLightPositionZ2 positionZ_light2 -50 50 0.1

/// checkbox light uSecond_Light_on_off preset 


#include <creation_object>
#include <dot2>
#include <scene_preset_0>
#include <RayMarch>
#include <get_normal>
#include <rand>

#include <init_object_lambert>



vec3 Model_Illumination(in vec3 ray_position,in vec3 ray_origin ,in Material hit_object){
    PointLight light1 = PointLight(vec3(uLightPositionX,uLightPositionY,uLightPositionZ),uColorLight,vec3(0.));
    PointLight light2 = PointLight(vec3(uLightPositionX2,uLightPositionY2,uLightPositionZ2),uColorLight2,vec3(0.));


    vec3 lightPosOffset = uRotatingLight*vec3(sin(2. * uTime), 0, cos(2. * uTime)) * 3.;
    light1.pos = light1.pos + lightPosOffset;
    light2.pos = light2.pos + lightPosOffset;

    light1.vector = normalize(light1.pos - ray_position); 
    light2.vector = normalize(light2.pos - ray_position); 



    vec3 normal = get_normal(ray_position); 
    float diffuse  = clamp(dot(light1.vector, normal), 0., 1.);
    float diffuse2  = clamp(dot(light2.vector, normal), 0., 1.);

    // shadow stuff
    vec3 position_offset = normal * SURF_DIST_MARCH * 1.2; // move the point above a little
    Material _; //useless stuff but needed for the next RayMarch
    float d = RayMarch(_, ray_position + position_offset, light1.vector);
    float d2 = RayMarch(_, ray_position + position_offset, light2.vector);
    if (d < length(light1.pos - ray_position)|| uSecond_Light_on_off*d2 < uSecond_Light_on_off*length(light2.pos - ray_position)) { // If true then we've shaded a point on some object before, 
    // If true then we've shaded a point on some object before, 
                                    // so shade the currnet point as shodow.
        diffuse *= .3;
        diffuse2 *= .3;

        // no half-shadow because the light source is a point.  
                                 
      
    }


    
    return (diffuse * hit_object.base_color * light1.col)+uSecond_Light_on_off*(diffuse2 * hit_object.base_color * light2.col); 
}


void main()
{

    vec2 uv = vertex_uv-0.5;
    vec3 color=vec3(0);
    
    vec3 camRight   = vec3( uCameraMatrix[0][0],  uCameraMatrix[0][1],  uCameraMatrix[0][2]);
	vec3 camUp      = vec3( uCameraMatrix[1][0],  uCameraMatrix[1][1],  uCameraMatrix[1][2]);
    vec3 camForward = vec3(-uCameraMatrix[2][0], -uCameraMatrix[2][1], -uCameraMatrix[2][2]);
    
    init_object();

    float nb_bounce =0.0;

    vec3 ray_position2;
    vec3 ray_origin2;
    vec3 ray_direction2;
    float distance_to_object2;
        
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
        Material hit_object2;
        float distance_to_object = RayMarch(hit_object, ray_origin, ray_direction);
        vec3 ray_position = ray_origin + ray_direction * distance_to_object;
       
        if(nb_bounce ==0.0)
        {
            color += Model_Illumination(ray_position, ray_origin, hit_object);

            ray_origin2 = ray_position;
            ray_direction2 = -2. * dot(get_normal(ray_position),ray_direction)*get_normal(ray_position)+ray_direction;
            distance_to_object2 = RayMarch(hit_object2, ray_origin2+get_normal(ray_position)*0.1, ray_direction2);
            ray_position2= ray_origin2 + ray_direction2 * distance_to_object2;
            if(intersect(ray_origin2,ray_position2,ray_direction2))
            {
                //color += Model_Illumination(ray_position2,ray_origin2 , hit_object2)/2.0;
                nb_bounce =1.0;

            }
        }
        if(nb_bounce ==1.0)
        {
            color += Model_Illumination(ray_position2,ray_origin2 , hit_object2);

            nb_bounce =0.0;
        
        }

    }

   
	pc_fragColor = vec4(color/(float(N_RAY))/2.0 , 1.0);
}