#version 330

const int MAX_LIGHTS = 8;
//light structs and uniforms
struct Light {
    vec4 position;
    vec4 direction;
    vec4 color;
    float linear_att;
    float quadratic_att;
    float spot_inner_cosine;
    float spot_outer_cosine;
    mat4 view_projection;
    int type; // 0 - directional; 1 - point; 2 - spot
    int cast_shadow;
};

in vec2 v_uv;
out vec4 fragColor;

uniform int u_num_lights;

layout (std140) uniform u_lights_ubo
{
    Light lights[MAX_LIGHTS]; 
};

uniform vec3 u_cam_pos;
uniform sampler2D u_tex_position;
uniform sampler2D u_tex_normal;
uniform sampler2D u_tex_albedo;
uniform sampler2D u_tex_ssao;

uniform mat4 u_view_matrix;


void main(){
    float ambient_occlusion = texture(u_tex_ssao, v_uv).r;
    vec3 position = texture(u_tex_position, v_uv).xyz;
    vec3 N = texture(u_tex_normal, v_uv).xyz;
    vec4 albedo_spec = texture(u_tex_albedo, v_uv);

    vec3 V = normalize(u_cam_pos - position);

    vec3 ambient = vec3(0.3 * albedo_spec.xyz * ambient_occlusion);
    vec3 lightning = ambient;
    vec3 viewDir = normalize(-position);

    vec3 diffuse_color;

    for(int i = 0; i < u_num_lights; i++){
        vec3 lightDir  = normalize((u_view_matrix *lights[i].position).xyz - position);
        

        float NdotL = max(0.0, dot(N,lightDir));

        diffuse_color = NdotL * albedo_spec.xyz * lights[i].color.xyz;

        vec3 halfwayDir = normalize(lightDir + viewDir);
        float spec = max(0.0, dot(N,halfwayDir));

        spec = pow(spec, 8);
        vec3 specular_color = spec * albedo_spec.w * lights[i].color.xyz;

        lightning += diffuse_color*ambient_occlusion+ specular_color;
    }
    fragColor = vec4(lightning,1.0);
    //fragColor = vec4(diffuse_color,1.0);
}