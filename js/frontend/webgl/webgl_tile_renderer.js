class instanced_tile_renderer {
    constructor(canvas, tileset_filename, tile_width = 16, tile_height = 16) {
        this.canvas = canvas;
        this.gl = canvas.getContext("webgl");
        // this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true); // texture flip
        this.tile_width = tile_width;
        this.tile_height = tile_height;
    
        if(!this.gl) {
            alert("WebGL not supported, you are running on an impossible target bro");
        }

        this.#load_tileset(tileset_filename);
    }

    // wow private functions suck in js lol, imagine using a # to denote private functions 
    #load_tileset(file_name) {
        this.tileset = new Array();

        // load the tileset image
        const image = new Image("assets/sprites/" + tileset + ".png");
        image.onload = () => {
            const cols = image.width / this.tile_width;
            const rows = image.height / this.tile_height;

            for(let i = 0; i < rows; i++) {
                for(let j = 0; j < cols; j++) {
                    // wow this is stupid, doesnt matter though, its preload time >:)
                    var temp_canvas = document.createElement("canvas");
                    temp_canvas.width = this.tile_width;
                    temp_canvas.height = this.tile_height;
                    var temp_ctx = temp_canvas.getContext("2d");
                    temp_ctx.drawImage(image, j * this.tile_width, i * this.tile_height, this.tile_width, this.tile_height, 0, 0, this.tile_width, this.tile_height);
                    var img_data = temp_ctx.getImageData(0, 0, this.tile_width, this.tile_height);


                    this.tileset.push(this.#create_gl_texture(img_data));
                }
            }
        }
    }

    #isPowerOf2(value) {
        return (value & (value - 1)) == 0;
    }

    #create_gl_texture(image) {
        const result = this.gl.createTexture();

        this.gl.bindTexture(this.gl.TEXTURE_2D, result);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

        // weird check, but webgl1 suppossedly requires power of 2 textures or something idk
        if(this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
        } else {
            // the parameters is just what i use in `brawl-engine`, but you can change those
            // https://registry.khronos.org/OpenGL-Refpages/gl4/html/glTexParameter.xhtml (some may not be supported by webgl but you can try lol)
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        }

        return result;
    }
}