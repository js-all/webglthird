const canvas = <HTMLCanvasElement>document.getElementById('glCanvas');
const gl = <WebGLRenderingContext>canvas.getContext('webgl');

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

async function importGLSLShader(gl: WebGLRenderingContext, path: string, type: number) {
    const f = await fetch(path);
    const t = await f.text();
    return loadShader(gl, type, t);
}

async function createShaderProgramFromPath(gl: WebGLRenderingContext, vsPath: string, fsPath: string) {
    const vsSource = await (await fetch(vsPath)).text();
    const fsSource = await (await fetch(fsPath)).text();
    return initShaderProgram(gl, vsSource, fsSource);
}

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (shader === null) throw new TypeError('shader is null, at loadshader, verify type');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error('shader not compiled properly see error')
    }
    return shader;
}

function initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    if (shaderProgram === null) throw new TypeError('Error while creating shader program, shader program is null');
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) throw new Error('an error occured while linking a shader program, ' + gl.getProgramInfoLog(shaderProgram))

    return shaderProgram;
}