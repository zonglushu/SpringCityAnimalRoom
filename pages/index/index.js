import {createPIXI} from "../../libs/pixi.miniprogram"
//某些库或代码可能需要动态执行 JavaScript 代码，而 eval 在严格模式下会被禁用。unsafeEval 可以绕过这一限制。
var unsafeEval = require("../../libs/unsafeEval")
//Spine 是一个 2D 骨骼动画工具，Pixi-Spine 是 Pixi.js 的插件，用于加载和播放 Spine 动画
var installSpine = require("../../libs/pixi-spine")
//Pixi-Animate 是 Pixi.js 的插件，用于加载和播放 Adobe Animate（Flash）导出的动画
var installAnimate = require("../../libs/pixi-animate")
//Live2D 是一个 2D 角色动画技术，通常用于虚拟角色（如 VTuber）。
var live2d = require("../../libs/live2d.min")
//Cubism 是 Live2D 的核心技术，用于处理角色模型和动画。
var Live2DCubismCore = require("../../libs/live2dcubismcore.min")
//Cubism 4 是 Live2D 的最新版本，提供了更强大的功能和性能。
var installCubism4 = require("../../libs/cubism4")
//该插件将 Live2D 集成到 Pixi.js 中，用于在 Pixi.js 中渲染 Live2D 模型。
var installPixiLive2d = require("../../libs/pixi-live2d-display")
//补间动画是一种平滑过渡效果，通常用于对象的移动、缩放、旋转等
var myTween = require("../../libs/myTween")
var PIXI = {dispatchEvent:function(){}};
Page({
    onLoad:function () {
        var info = wx.getSystemInfoSync();
        var sw = info.screenWidth;//获取屏幕宽高
        var sh = info.screenHeight;//获取屏幕宽高
        var tw = 750;
        var th = parseInt(tw*sh/sw);//计算canvas实际高度
        var stageWidth = tw;
        var stageHeight = th;
        var query = wx.createSelectorQuery();
        query.select('#myCanvas').node().exec((res) => {
            var canvas = res[0].node;

            console.log("这是我的canvas",canvas)
            canvas.width = sw;//设置canvas实际宽高
            canvas.height = sh;//设置canvas实际宽高,从而实现全屏
            PIXI = createPIXI(canvas,stageWidth);//传入canvas，传入canvas宽度，用于计算触摸坐标比例适配触摸位置
            unsafeEval(PIXI);//适配PIXI里面使用的eval函数
            installSpine(PIXI);//注入Spine库
            installAnimate(PIXI);//注入Animate库
            installCubism4(PIXI,Live2DCubismCore);
            installPixiLive2d(PIXI,live2d,Live2DCubismCore);
            var renderer = PIXI.autoDetectRenderer({width:stageWidth, height:stageHeight,backgroundAlpha:1,premultipliedAlpha:true,preserveDrawingBuffer:true,'view':canvas});//通过view把小程序的canvas传入
            var stage = new PIXI.Container();
            var bg = PIXI.Sprite.from("./img/bg.jpg");
            console.log("小程序的背景",bg);
            bg.width=stageWidth
            
            bg.height=stageHeight

            stage.addChild(bg);
            bg.eventMode = 'static';
            bg.on("pointerdown",function(e){
                console.log("pointerdown",e.data.global)
            });
            bg.on("pointerup",function(e){
                console.log("touchend")
                return;
				// 获取base64图像
                const b64Data = canvas.getContext("webgl").canvas.toDataURL()
                const time = new Date().getTime();
                const filePath = `${wx.env.USER_DATA_PATH}/temp_image_${time}.png`
                // base64格式的图片要去除逗号前面的部分才能正确解码
                const buffer = wx.base64ToArrayBuffer(b64Data.substring(b64Data.indexOf(',') + 1))
                // 写入临时文件
                wx.getFileSystemManager().writeFile({
                    filePath,
                    data: buffer,
                    encoding: 'utf8',
                    success: res => {
                        console.log('保存图片：', filePath)
                        wx.saveImageToPhotosAlbum({
                            filePath:filePath,
                            success(res) {
                                console.log('已保存图片到相册')
                            }
                        })
                    }
                })
            });
            //小程序不支持加载本地fnt，json文件，所以涉及到fnt，json文件的加载需要放到网络服务器
            PIXI.Assets.add("blog","https://raw.githubusercontent.com/skyfish-qc/imgres/master/blog.fnt")
            PIXI.Assets.add("mc","https://raw.githubusercontent.com/skyfish-qc/imgres/master/mc.json")
            PIXI.Assets.add('spineboypro', "https://raw.githubusercontent.com/skyfish-qc/imgres/master/spineboy-pro.json")
            PIXI.Assets.load(["blog","mc","spineboypro"]).then(async function(res){
                var btext = new PIXI.BitmapText('score:1234',{'fontName':'blog','fontSize':60,'tint':0xffff00});
                btext.x = 40;
                btext.y = 140;
                stage.addChild(btext);
                var explosionTextures = [];
                for (var i = 0; i < 26; i++) {
                    var texture = PIXI.Texture.from('pic'+(i+1)+'.png');
                    explosionTextures.push(texture);
                }
                for (i = 0; i < 2; i++) {
                    var explosion = new PIXI.AnimatedSprite(explosionTextures);

                    explosion.x = Math.random() * stageWidth;
                    explosion.y = Math.random() * stageHeight*0.2;
                    explosion.anchor.set(0.5);
                    explosion.rotation = Math.random() * Math.PI;
                    explosion.scale.set(0.75 + Math.random() * 0.5);
                    explosion.gotoAndPlay((Math.random() * 27|0));
                    stage.addChild(explosion);
                }
                var spineBoyPro = new PIXI.spine.Spine(res.spineboypro.spineData);
                spineBoyPro.x = stageWidth / 2;
                spineBoyPro.y = 1200;

                spineBoyPro.scale.set(0.5);
                spineBoyPro.state.setAnimation(0, "hoverboard",true);
                stage.addChild(spineBoyPro);
                
                //测试Animate
                var mymc = new PIXI.animate.MovieClip();
                stage.addChild(mymc);

                const testTxt = new PIXI.Text("test",{fill:'#ff0000',fontSize:44});
                testTxt.x = 100;
                testTxt.y = 400;
                stage.addChild(testTxt);

                const testTxt2 = new PIXI.Text("",{fill:'#ff0000',fontSize:44});
                testTxt2.x = 100;
                testTxt2.y = 500;
                stage.addChild(testTxt2);
                testTxt2.text = "test2";

                const graphics = new PIXI.Graphics();
                graphics.beginFill(0xFF3300);
                graphics.drawRect(0, 0, 100, 100);
                graphics.endFill();
                graphics.x = 100;
                graphics.y = 200;
                stage.addChild(graphics);

                const graphics2 = new PIXI.Graphics();
                graphics2.beginFill(0xFFFF00);
                graphics2.drawRect(0, 0, 200, 200);
                graphics2.endFill();
                graphics2.x = 200;
                graphics2.y = 400;
                stage.addChild(graphics2);

                //遮罩示例start
                //遮罩示意shader
                var frag = `
                varying vec2 vTextureCoord;
                uniform vec4 inputPixel;
                uniform vec2 dimensions;
                uniform sampler2D uSampler;
                uniform sampler2D masktex;
                void main(void) {
                    vec4 color = texture2D(uSampler, vTextureCoord);
                    vec2 coord = vTextureCoord.xy * inputPixel.xy / dimensions.xy;
                    vec4 maskcolor = texture2D(masktex, coord);
                    gl_FragColor = color*maskcolor;
                }
                `;
                const maskshape = new PIXI.Graphics();
                maskshape.beginFill(0xFFFFFF);//用于遮罩的形状必须为白色，因为shader遮罩原理是目标颜色乘以遮罩形状颜色，设置成白色可以避免干扰目标颜色。
                maskshape.drawCircle(100, 100, 100);
                maskshape.endFill();
                maskshape.x = 200;
                maskshape.y = 600;
                stage.addChild(maskshape);//先加入渲染
                var masktex = renderer.generateTexture(maskshape);//获取到遮罩形状纹理，如果是直接加载外部遮罩图片，上面部分可以省略。
                stage.removeChild(maskshape);//获得纹理后移除
                var uniform = {
                    masktex:masktex,
                    dimensions: [200, 200]//传入遮罩纹理图片尺寸，用于计算纹理的实际uv
                }
            
                var shader = new PIXI.Filter(null,frag,uniform);
                graphics2.filters = [shader];//给graphics2物体进行遮罩，原来是方形的经过遮罩后变成圆形
                //遮罩示例end

                //live2d
                const cubism4Model = "https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json";
                const model4 = await PIXI.live2d.Live2DModel.from(cubism4Model);
                model4.scale.set(0.15);
                model4.x = 100
                model4.y = 400
                stage.addChild(model4);


                renderer.render(stage);
                
            });
            //myTween缓动库使用示例
            /*
            缓动公式：Linear,Quad,Cubic,Quart,Sine,Expo,Circ,Elastic,Back,Bounce,Quint
            比如myTween.Quad.Out,myTween.Quad.In,myTween.Quad.InOut
            onEnd:结束事件
            onUpdate:每帧触发
            myTween.clean();//清除所有事件
            */
            var tweenObj = PIXI.Sprite.from("img/head.png");
            tweenObj.y = 500;
            stage.addChild(tweenObj);
            var tx = 600;
            function tweenMove() {
                myTween.to(tweenObj,1,{x:tx,ease:myTween.Quad.Out,onEnd:function(){
                    if(tx>0) {
                        tx = 0;
                    } else {
                        tx = 600;
                    }
                    tweenMove();
                }});
            }
            tweenMove();
            function animate() {
                canvas.requestAnimationFrame(animate);
                renderer.render(stage);
                myTween.update();
            }
            animate();
            // renderer.render(stage);
        });
    },
    touchEvent:function(e){
        //接收小程序的触摸事件传给PIXI
        PIXI.dispatchEvent(e);
    }
})
