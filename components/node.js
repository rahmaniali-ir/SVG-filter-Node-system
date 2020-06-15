
const nodeTemplate = document.createElement('template')
nodeTemplate.innerHTML = /*html*/ `
<div class="node-wrapper">
    <div class="node">
        <div class="title">
            <div class="toggle"><span></span></div>
            <span>Title</span>
            <div class="delete"><span></span></div>

        </div>

        <div class="node-box">
        </div>
    </div>
</div>`

const paramTemplate = document.createElement('template')
paramTemplate.innerHTML = `
<div class="param">
    <div class="point"></div>
    <span></span>
</div>`

class Node extends HTMLElement {
    wrapper = null
    node = null
    box = null

    nodeDrag = {
        enable: false,
        x: 0,
        y: 0
    }

    static get observedAttributes() {
        return ['x', 'y', 'n-title', 'color', 'immortal']
    }

    constructor() {
        // init component
        super()
        this.append(nodeTemplate.content.cloneNode(true))

        // cash selectors
        this.wrapper = this.querySelector('.node-wrapper')
        this.node = this.wrapper.querySelector('.node')
        this.box = this.wrapper.querySelector('.node-box')

        // adjust position
        this.refreshPosition()

        // title
        this.querySelector('.title > span').textContent = this.getAttribute('n-title')
        this.querySelector('.title').style.backgroundColor = this.getAttribute('color')

        // immortality
        let isImmortal = Boolean(this.getAttribute('immortal'))
        if(isImmortal) this.node.classList.add('immortal')

        // inputs
        let inputs = this.getAttribute('input')
            ?.replace(' ', '')
            .split(',')

        if(inputs) {
            inputs.forEach(input => {
                let element = paramTemplate.content.cloneNode(true)
                element.querySelector('.param').classList.add('param-in')
                element.querySelector('span').textContent = input
                this.box.append(element)
            })
        }

        // outputs
        let outputs = this.getAttribute('output')
            ?.replace(' ', '')
            .split(',')

        if(outputs) {
            outputs.forEach(output => {
                let element = paramTemplate.content.cloneNode(true)
                element.querySelector('.param').classList.add('param-out')
                element.querySelector('span').textContent = output
                this.box.append(element)
            })
        }
    }

    connectedCallback() {
        this.querySelector('.toggle').addEventListener('click', () => {
            this.node.classList.toggle('closed')
        })

        this.querySelector('.title > span').addEventListener('mousedown', e => {
            const playground = document.querySelector('.node-playground')
            let scrollY = playground.clientHeight - playground.scrollHeight
            let scrollX = playground.clientWidth - playground.scrollWidth

            this.nodeDrag.x = e.offsetX + scrollX
            this.nodeDrag.y = e.offsetY + scrollY

            this.nodeDrag.enable = true
        })

        window.addEventListener('mouseup', () => {
            this.nodeDrag.enable = false
        })

        window.addEventListener('mousemove', e => {
            if(this.nodeDrag.enable) {
                let x = e.pageX - this.nodeDrag.x
                let y = e.pageY - this.nodeDrag.y

                this.setAttribute('x', x)
                this.setAttribute('y', y)

                this.refreshPosition()
            }
        })

        this.querySelectorAll('.point').forEach(point => {
            point.addEventListener('mousedown', e => {
                let x = e.clientX
                let y = e.clientY

                let event = new CustomEvent('start-path', {
                    detail: {
                        x,
                        y
                    }
                })

                this.dispatchEvent(event)
            })
        })
    }

    refreshPosition() {
        this.style.top = this.getAttribute('y') + 'px'
        this.style.left = this.getAttribute('x') + 'px'
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch(name) {
            case 'x':
            case 'y':
                this.refreshPosition()
                break

            case 'n-title':
                this.querySelector('.title > span').textContent = this.getAttribute('n-title')
                    break

            case 'color':
                this.querySelector('.title').style.backgroundColor = this.getAttribute('color')
                    break
        }
    }
}

window.customElements.define('node-element', Node)
