uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

void main() {

    vec4 model_position = modelMatrix * vec4( position, 1.0 );
    vec4 view_model_position = viewMatrix * model_position;
    vec4 projection_view_model_position = projectionMatrix * view_model_position;

    gl_Position = projection_view_model_position;

}