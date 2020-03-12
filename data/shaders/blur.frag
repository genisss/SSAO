#version 330

//varyings and out color
in vec2 v_uv;

layout (location = 0) out float fragColor;

//texture uniforms
uniform sampler2D u_tex_ssao;


void main(){
	vec2 texel_size = 1.0/vec2(textureSize(u_tex_ssao,0));
	float result = 0.0;
	for(int x = -2; x<2; ++x){
		for(int y = -2; y<2; ++y){
			vec2 offset = vec2(float(x), float(y)) * texel_size;
			result+= texture(u_tex_ssao,v_uv + offset).r;
		}
	}
	fragColor = result /(4.0 * 4.0);
}