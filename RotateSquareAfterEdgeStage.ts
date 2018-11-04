const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 5
const edges : number = 3
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

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        const scGap : number = 0.05
        const k : number = Math.floor(this.scale / 0.5)
        this.scale += (this.dir * scGap) * (k *  + (1 - k)/edges)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

const divideScale = (scale : number, i : number, n : number) : number => {
    return Math.min(1/n, Math.max(0, scale - i * (1 / n))) * n
}
class RSAENode {
    prev : RSAENode
    next : RSAENode
    state : State = new State()
    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new RSAENode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        const gap : number = w / (nodes + 1)
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = 'teal'
        const a : number = gap / 3
        const deg : number = 2 * Math.PI / edges
        context.save()
        context.translate(this.i * (gap + 1), h/2)
        const sc1 : number = divideScale(this.state.scale, 0, 2)
        const sc2 : number = divideScale(this.state.scale, 1, 2)
        context.rotate(Math.PI * sc2)
        for (var i = 0; i < edges; i++) {
            const sc : number = divideScale(sc1, i, edges)
            context.save()
            context.rotate(deg * i)
            context.translate(0, a / Math.tan(deg/2))
            context.moveTo(-a * sc, 0)
            context.lineTo(a * sc, 0)
            context.stroke()
            context.restore()
        }
        context.restore()
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : RSAENode {
        var curr : RSAENode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class RotateSquareAfterEdge {
    curr : RSAENode = new RSAENode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {
    rsae : RotateSquareAfterEdge = new RotateSquareAfterEdge()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        context.fillStyle = '#BDBDBD'
        context.fillRect(0, 0, w, h)
        this.rsae.draw(context)
    }

    handleTap(cb : Function) {
        this.rsae.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.rsae.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}
