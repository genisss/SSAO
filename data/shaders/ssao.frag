#version 330


in vec2 v_uv;

layout (location = 0) out float fragColor;


uniform sampler2D u_tex_position;
uniform sampler2D u_tex_normal;
uniform sampler2D u_tex_noise;
uniform mat4 u_projection_matrix;

uniform vec3 samples[64];

int kernelSize = 64;
float radius = 1.2;
float bias = 0.10;

const vec2 noiseScale = vec2 (800/4.0, 600/4.0);


void main(){
    vec3 fragPos = texture (u_tex_position, v_uv).xyz;
    vec3 normal = normalize(texture(u_tex_normal, v_uv).rgb);
    vec3 randomVec = normalize(texture(u_tex_noise, v_uv*noiseScale).xyz);

    vec3 tangent = normalize(randomVec - normal * dot(randomVec,normal));
    vec3 bitangent = cross(normal,tangent);
    mat3 TBN = mat3(tangent,bitangent,normal);

    float occlusion = 0.0;
    for(int i = 0; i< kernelSize; i++){
        vec3 sample = TBN*samples[i];
        sample = fragPos + sample * radius;

        vec4 offset = vec4(sample, 1.0);
        offset = u_projection_matrix * offset;
        offset.xyz /= offset.w;
        offset.xyz = offset.xyz * 0.5 + 0.5;

        vec3 occluderPos = texture(u_tex_position, offset.xy).rgb;

        float rangeCheck = smoothstep(0.0, 1.0, radius/length(fragPos - occluderPos));
        occlusion += (occluderPos.z >= sample.z + bias ? 1.0 : 0.0) * rangeCheck;
    }
    fragColor = pow((1.0 - (occlusion / kernelSize)), 2);

}