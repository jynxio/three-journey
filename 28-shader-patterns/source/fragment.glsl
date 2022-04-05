#define PI 3.1415926535897932384626433832795

precision mediump float;

varying vec2 vUv;
varying float vTime;

vec4 simpleWarping( vec2 uv, float time ) {

    for ( float i = 1.0; i < 10.0; i++ ) {

        uv.x += 0.6 / i * cos( i * 2.5 * uv.y + time );
        uv.y += 0.6 / i * cos( i * 1.5 * uv.x + time );

    }

    float strength = sin( time - uv.y - uv.x );

    strength = abs( strength );
    strength = floor( strength * 20.0 ) / 20.0;

    vec3 rgb = vec3( strength );
    vec4 color = vec4( rgb, 1.0 );

    return color;

}

vec4 myWarping( vec2 uv, float time ) {

    time /= 5.0;

    for ( float i = 1.0; i < 10.0; i++ ) {

        uv.x += 0.6 / i * cos( i * 2.0 * uv.y + time );
        uv.y += 0.6 / i * cos( i * 5.0 * uv.x + time );

    }

    float strength = sin( time - uv.y - uv.x );

    strength = abs( strength );
    strength = clamp( 0.1 / strength, 0.1, 1.1 ) - 0.1;
    strength = floor( strength * 5.0 ) / 5.0;

    vec3 color1 = vec3( 0.067, 0.078, 0.098 );
    vec3 color2 = vec3( 0.38, 0.44, 0.93 );
    vec3 mixedColor = mix( color1, color2, strength );

    return vec4( mixedColor, 1.0 );

}

void main() {

    gl_FragColor = myWarping( vUv, vTime );

}
