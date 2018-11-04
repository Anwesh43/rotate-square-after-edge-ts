const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 5
class RotateSquareAfterEdgeStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')

    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#BDBDBD'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : RotateSquareAfterEdgeStage = new RotateSquareAfterEdgeStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
