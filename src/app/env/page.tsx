'use client';

import { title } from '@/app/components/primitives'
import { useEffect, useRef } from 'react'
import p5 from 'p5'

/** 
 * /!\ NO VIBE CODE ALLOWED BEYOND THIS POINT /!\
 *   _____         _                           _   
 *  |   __|___ _ _|_|___ ___ ___ ___ _____ ___| |_ 
 * |   __|   | | | |  _| . |   | -_|     |   |  _|
 * |_____|_|_|\_/|_|_| |___|_|_|___|_|_|_|_|_|_|  
 *                                              
 * (i) notice: VAR > LET
 */
export default function EnvironmentPage() {

    const containerRef = useRef<HTMLDivElement>(null)
    const sketchRef = useRef<p5>()

    useEffect(() => {
    
        // Create p5 sketch
        if(containerRef.current) {
            sketchRef.current = new p5(sketch, containerRef.current)
        }
    
        // Remove p5 sketch
        return () => {
          sketchRef.current?.remove()
        }
    }, [])

    return (
        <div>
            <h1 className={title()}>Env and stuff yk</h1>
            <div ref={containerRef}>
                {/* canvas */}
            </div>
        </div>
    )
}

const sketch = (p: p5) => {

    const size = 3
    const gridWidth = 40
    const gridHeight = 40

    var image: p5.Image
    var tiles: Tile[]
    var cells: Cell[]

    p.setup = async () => {
        p.createCanvas(800, 800)
        p.noSmooth()

        image = await p.loadImage('/tile-sockets.png')

        // image -> tile[]
        tiles = []
        const s = size + 1
        for(var x=0; x<image.width/s; x++) {
            for(var y=0; y<image.height/s; y++) {
                const tileImage = image.get(x * s, y * s, size, size)

                // last (2) tiles are blank
                if(x >= (image.width/s) - 2 && y >= (image.height/s) - 1) continue

                tileImage.loadPixels()

                tiles.push({
                    image: tileImage,
                    edges: {
                        up:    Array(tileImage.width).keys().toArray().map(x => colorOf(tileImage, x, 0)),
                        down:  Array(tileImage.width).keys().toArray().map(x => colorOf(tileImage, tileImage.width - 1 - x, tileImage.height - 1)),
                        right: Array(tileImage.height).keys().toArray().map(y => colorOf(tileImage, 0, y)),
                        left:  Array(tileImage.height).keys().toArray().map(y => colorOf(tileImage, tileImage.width - 1, y))
                    },
                    adjacency: {
                        up: [],
                        down: [],
                        left: [],
                        right: []
                    }
                })
            }
        }

        // add rotated tiles
        tiles = tiles.flatMap((tile) => (
            uniqueTilesOf(
                Array(4).keys().toArray().map((rotation) => rotateTile(tile, rotation))
            )
        ))

        // adjacency rules
        for(var tile of tiles) {
            resolveAdjacencyTileRules(tile)
        }

        console.log('tiles', tiles)


        initialize()
    }

    p.draw = () => {
        p.background(0)
        // p.image(image, 0, 0, image.width * 20, image.height * 20)

        // draw grid
        const tileWidth = p.width / gridWidth
        const tileHeight = p.width / gridHeight
        for(var x=0; x<gridWidth; x++) {
            for(var y=0; y<gridHeight; y++) {
                var i = x + y * gridWidth

                // var img = tiles[i]?.image
                // if(img) p.image(img, x * tileWidth, y * tileHeight, tileWidth, tileHeight)
                // continue

                const cell = cells[i]

                if(cell.collapsed) {
                    p.image(cell.tile.image, x * tileWidth, y * tileHeight, tileWidth, tileHeight)
                }
            }
        }

        iterate()
    }

    p.mouseClicked = () => {
        initialize()
    }

    function initialize() {
        cells = Array(gridWidth * gridHeight).fill(null).map(() => ({
            collapsed: false,
            possibilities: [...tiles]
        }))
    }

    function iterate() {

        // get cells with least entropy
        const sortedCells = cells
            .filter(cell => !cell.collapsed)
            .sort((a, z) => a.possibilities.length - z.possibilities.length)
        const [cellWithLeastEntropy] = sortedCells
        const cellsWithLeastEntropy = sortedCells.filter(cell => cell.possibilities.length == cellWithLeastEntropy.possibilities.length)

        // pick random cell and tile
        const cell = randomArrayItemOf(cellsWithLeastEntropy)

        // done
        if(cell == null) {
            console.log('done')
            return
        }
        
        cell.collapsed = true
        const tile = randomArrayItemOf(cell.possibilities)
        
        // failed
        if(tile == null) {
            console.log('failed')
            return initialize()
        }

        cell.tile = tile

        // resolve new possibilities
        const nextCells = []
        for(var x=0; x<gridWidth; x++) {
            for(var y=0; y<gridHeight; y++) {
                const index = (x: number, y: number) => x + y * gridWidth
                var i = index(x, y)
                
                if(cells[i].collapsed) {
                    nextCells[i] = cells[i]
                }

                else {
                    const validUpPossibilities = cells[index(x, y - 1)]?.possibilities ?.flatMap(tile => tile.adjacency.down) ?? []
                    const validDownPossibilities = cells[index(x, y + 1)]?.possibilities?.flatMap(tile => tile.adjacency.up) ?? []
                    const validLeftPossibilities = cells[index(x - 1, y)]?.possibilities?.flatMap(tile => tile.adjacency.right) ?? []
                    const validRightPossibilities = cells[index(x + 1, y)]?.possibilities?.flatMap(tile => tile.adjacency.left) ?? []
                    
                    /*
                    console.log({
                        validUpPossibilities,
                        validDownPossibilities,
                        validLeftPossibilities,
                        validRightPossibilities
                    })
                    debugger;
                    */

                    const validPossibilities = Array.from(
                        /*
                        new Set(validUpPossibilities)
                            .intersection(new Set(validDownPossibilities))
                                .intersection(new Set(validLeftPossibilities))
                                    .intersection(new Set(validRightPossibilities))
                                    */

                                    
                        //new Set([...tiles]).difference(
                            new Set([
                                ...validUpPossibilities,
                                ...validDownPossibilities,
                                ...validLeftPossibilities,
                                ...validRightPossibilities
                            ])
                        //)
                    )

                    // console.log(cells[i].possibilities, ' -> ', validPossibilities)
    
                    nextCells[i] = {
                        collapsed: false,
                        possibilities: validPossibilities
                    }
                }

            }
        }

        cells = nextCells
    }

    function rotateTile(tile: Tile, rotation: number): Tile {
        const { up, right, down, left } = tile.edges
        const rotatedEdges = rotateArray([up, right, down, left], rotation)
        return {
            image: rotateImage(tile.image, rotation),
            edges: {
                up: rotatedEdges[0],
                down: rotatedEdges[1],
                left: rotatedEdges[2],
                right: rotatedEdges[3]
            },
            adjacency: {
                up: [],
                down: [],
                left: [],
                right: []
            }
        }
    }

    function rotateArray<T>(arr: T[], n: number) {
        const len = arr.length;
        n = n % len;
        return arr.slice(-n).concat(arr.slice(0, -n));
      }

    function rotateImage(image: p5.Image, rotations: number) {
        const { width, height } = image
        const g = p.createGraphics(width, height)
        g.noSmooth()
        g.imageMode(p.CENTER)
        g.translate(width / 2, height / 2)
        g.rotate(p.radians(90 * rotations))
        g.image(image, 0, 0)
        return g.get()
    }

    function randomArrayItemOf<T>(array: T[]) {
        return array[Math.floor(Math.random() * array.length)]
    }

    function uniqueTilesOf(tiles: Tile[]): Tile[] {
        const uniqueTilesMap = {}
        for (const tile of tiles) {
            const { up, down, left, right } = tile.edges
            const key = [up, down, left, right].map(edge => edge.join(',')).join(';')
            uniqueTilesMap[key] = tile
        }
        return Object.values(uniqueTilesMap)
    }

    function resolveAdjacencyTileRules(tile: Tile) {

        function equal(edge: string[], otherEdge: string[]) {
            return edge.join(',') == otherEdge.toReversed().join(',')
        }

        for(var otherTile of tiles) {
            if(equal(otherTile.edges.up, tile.edges.down)) tile.adjacency.down.push(otherTile)
            if(equal(otherTile.edges.left, tile.edges.right)) tile.adjacency.right.push(otherTile)
            if(equal(otherTile.edges.down, tile.edges.up)) tile.adjacency.up.push(otherTile)
            if(equal(otherTile.edges.right, tile.edges.left)) tile.adjacency.left.push(otherTile)
        }
    }

    function colorOf(image: p5.Image, x: number, y: number) {
        const index = (x: number, y: number) => x + y * image.width
        const i = index(x, y) * 4
        const [r, g, b, a] = image.pixels.slice(i, i + 4)
        // console.log('i', i, x, y, [r, g, b, a], image.pixels.length)
        return rgbaToHex([r, g, b, a])
    }

    function rgbaToHex([r, g, b, a]) {
        return (
            '#' +
            [r, g, b, a]
            .map(v => v.toString(16).padStart(2, '0'))
            .join('')
        );
    }

    interface Cell {
        collapsed: boolean
        tile?: Tile
        possibilities: Tile[]
    }

    interface Tile {
        image: p5.Image
        edges: {
            up: string[]
            down : string[]
            left: string[]
            right: string[]
        }
        adjacency: {
            up: Tile[]
            down : Tile[]
            left: Tile[]
            right: Tile[]
        }
    }
}