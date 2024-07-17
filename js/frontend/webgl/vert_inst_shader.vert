attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec2 a_instanceOffset;

varying vec2 v_texcoord; 

void main() {
    vec4 offsetPosition = vec4(a_position.xy + a_instanceOffset, a_position.zw);
    
    gl_Position = offsetPosition;
    v_texcoord = a_texcoord;
}