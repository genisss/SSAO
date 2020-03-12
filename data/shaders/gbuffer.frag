#version 330

//these out variables correspond to the gbuffer textures
layout (location = 0) out vec3 g_position;
layout (location = 1) out vec3 g_normal;
layout (location = 2) out vec4 g_albedo;

//read data from vert shader
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_vertex_world_pos;

//uniforms
uniform int u_use_diffuse_map;
uniform sampler2D u_diffuse_map;
uniform vec3 u_diffuse;
uniform vec3 u_specular;

void main(){
    //store our fragment position
    g_position = v_vertex_world_pos;
    //the normal
    g_normal = normalize(v_normal);

    //average the specular color
    float specular = (u_specular.x + u_specular.y + u_specular.z) / 3;
    //get diffuse color
    vec3 diffuse = u_diffuse;
    if(u_use_diffuse_map > 0 ){
        diffuse *= texture(u_diffuse_map, v_uv).xyz;
    }
    //mix diffuse color with specular
    g_albedo = vec4 (diffuse,specular);
}