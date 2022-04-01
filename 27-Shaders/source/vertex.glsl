uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;
// attribute float aRandom;

// varying float vRandom;

void main() {

    // vRandom = aRandom;

    vec4 model_position = modelMatrix * vec4( position, 1.0 );

    model_position.z += sin( model_position.x * uFrequency.x - uTime ) * 0.1;
    model_position.z += sin( model_position.y * uFrequency.y - uTime ) * 0.1;
    // model_position.z += aRandom * 0.1;
    // model_position.z += sin( model_position.x * 10.0 ) * 0.05;
    // model_position.z += cos( model_position.y * 10.0 ) * 0.05;

    vec4 view_position = viewMatrix * model_position;
    vec4 projection_position = projectionMatrix * view_position;

    gl_Position = projection_position;

}