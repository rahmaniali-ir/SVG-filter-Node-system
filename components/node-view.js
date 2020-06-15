
const nodeViewTemplate = document.createElement('template')
nodeViewTemplate.innerHTML = /*html*/ `
<div class="node-view">
    <div class="node-playground">
        <node-element x="20" y="80" n-title="SourceGraphic" output="result" color="#454545" immortal="true"></node-element>
        <node-element x="630" y="80" n-title="FinalResult" input="in" color="#454545" immortal="true"></node-element>

        <node-element x="180" y="20" n-title="red" input="in, in2" output="result"></node-element>
        <node-element x="240" y="120" n-title="blue" input="in, in2" output="result" color="blue"></node-element>
        <node-element x="420" y="120" n-title="yellow-one-with-long-title" input="in, in2" output="result" color="purple"></node-element>
    </div>

    <div class="controls">
        <button class="add-node">
            ADD
        </button>
    </div>
</div>`

class NodeView extends HTMLElement {
    playground = null

    constructor() {
        // init component
        super()
        this.append(nodeViewTemplate.content.cloneNode(true))

        this.playground = this.querySelector('.node-playground')

        let defaultElements = this.querySelectorAll('node-element')
        defaultElements.forEach(element => {
            element.addEventListener('start-path', e => {
                const uri = 'http://www.w3.org/2000/svg'
                let svg = document.createElementNS(uri, 'svg')
                let path = document.createElementNS(uri, 'path')

                svg.setAttribute('viewBox', '0 0 100 100')
                svg.style.height = '100px'
                svg.style.width = '100px'
                svg.style.left = e.detail.x + 'px'
                svg.style.top = e.detail.y + 'px'

                path.setAttribute('d', `
                    M0,0 L100,100
                `)
                path.setAttribute('fill', 'transparent')
                path.setAttribute('stroke', '#fff8')
                path.setAttribute('stroke-width', '1.5')

                svg.append(path)
                this.playground.append(svg)
                console.log(svg)
            })
        })
    }

    instances = 0
    connectedCallback() {
        window.addEventListener('keydown', e => {
            if(e.code == 'Space') {
                this.playground.classList.add('hand')
            }
        })

        window.addEventListener('keyup', e => {
            this.playground.classList.remove('hand')
        })

        this.querySelector('.add-node').addEventListener('click', () => {
            let newNode = new Node()
            let x = Math.random() * this.playground.clientWidth
            let y = Math.random() * this.playground.clientHeight
            newNode.setAttribute('x', x)
            newNode.setAttribute('y', y)

            newNode.setAttribute('n-title', 'node-' + this.instances)
            this.instances++

            newNode.setAttribute('color', 'green')

            this.playground.append(newNode)
        })
    }
}

window.customElements.define('node-view', NodeView)
