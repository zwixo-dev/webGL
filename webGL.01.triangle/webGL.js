window.addEventListener('load',()=>{

    const vertexShaderText = [
        "precision mediump float;",
        "",
        "attribute vec2 vertPosition;",
        "attribute vec3 vertColor;",
        "varying vec3 fragColor;",
        "uniform float screenWidth; ",
        "",
        "",
        "void main()",
        "{",
        "fragColor = vertColor;",
        "gl_Position = vec4(vertPosition, 0.0, 1.0);",
        "}"
    ].join("\n");

    const fragmentShaderText = [
        "precision mediump float;",
        "",
        "varying vec3 fragColor;",
        "void main()",
        "{",
        "gl_FragColor = vec4(fragColor, 1.0);",
        "}"
    ].join("\n");

    const canvas = document.querySelector("canvas");

    canvas.style.width= 800 + "px";
    canvas.style.height= 600+ "px";
    canvas.style.background="#E7DFC6";
    

    document.body.style.padding="0";
    document.body.style.margin="0";
    document.body.style.overflow="hidden";

    const webGL = canvas.getContext("webgl");

    if(!webGL){
        console.log("webGL not supported in that browser try with another one");
    }

    webGL.clearColor(0.49, 1.0, 0.83, 1.0);
    webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);

    // shader 

    const vertexShader = webGL.createShader(webGL.VERTEX_SHADER);
    const fragmentShader = webGL.createShader(webGL.FRAGMENT_SHADER);

    webGL.shaderSource(vertexShader, vertexShaderText);
    webGL.shaderSource(fragmentShader, fragmentShaderText);
    
    webGL.compileShader(vertexShader);

    if(!webGL.getShaderParameter(vertexShader, webGL.COMPILE_STATUS)){
        console.error("ERROR to compile vertex Shader !", webGL.getShaderInfoLog(vertexShader));
        return;
    }

    webGL.compileShader(fragmentShader);

    if(!webGL.getShaderParameter(fragmentShader, webGL.COMPILE_STATUS)){
        console.error("ERROR to compile fragment Shader !", webGL.getShaderInfoLog(fragmentShader));
        return;
    }

    const program = webGL.createProgram();
    webGL.attachShader(program, vertexShader);
    webGL.attachShader(program, fragmentShader);

    webGL.linkProgram(program);

    if(!webGL.getProgramParameter(program, webGL.LINK_STATUS)){
        console.error("Error to link the program ! ", webGL.getProgramInfoLog(program));
        return;
    }

    webGL.validateProgram(program);

    if(!webGL.getProgramParameter(program, webGL.VALIDATE_STATUS)){
        console.error("Error to validate the program ! ", webGL.getProgramInfoLog(program));
        return;
    }

    // buffer creation 
    
    const triangleVertices = 
    [ // x , Y               R,    G,    B
        0.0, 0.5,           1.0,  0.1,  0.2,
        -0.5, -0.5,         0.6,  0.4,  1.0,
        0.5, -0.5,          0.8,  0.9,  0.2,
    ];

    const triangleVetrexBufferObj = webGL.createBuffer();
    webGL.bindBuffer(webGL.ARRAY_BUFFER, triangleVetrexBufferObj);
    webGL.bufferData(webGL.ARRAY_BUFFER, new Float32Array(triangleVertices), webGL.STATIC_DRAW);

    const positionAttribLocation = webGL.getAttribLocation(program, "vertPosition");
    const colorAttribLocation = webGL.getAttribLocation(program, "vertColor");

    webGL.vertexAttribPointer(
        // attrib location
        positionAttribLocation
        ,
        2 //num of elements per attribute
        ,
        webGL.FLOAT // type of elements 
        , 
        false
        ,
        5 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );


    webGL.vertexAttribPointer(
        // attrib location
        colorAttribLocation
        ,
        3 //num of elements per attribute
        ,
        webGL.FLOAT // type of elements 
        , 
        false
        ,
        5 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT
    );


    webGL.enableVertexAttribArray(positionAttribLocation);
    webGL.enableVertexAttribArray(colorAttribLocation);

    // render loop

    webGL.useProgram(program);
    webGL.drawArrays(webGL.TRIANGLES, 0, 3);

});