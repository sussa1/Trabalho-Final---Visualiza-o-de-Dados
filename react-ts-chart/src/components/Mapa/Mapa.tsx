import * as d3 from 'd3';
import "./Mapa.css";
import React from 'react';

interface IProps {
    width: number,
    height: number,
    estadoCallBack: any
}

interface IState {
    estadoSelecionado: string
}

class Mapa extends React.Component<IProps, IState> {

    ref!: SVGSVGElement;

    buildGraph() {
        // The svg
        var svg = d3.select(this.ref);

        // Map and projection
        var projection = d3.geoMercator()
            .precision(0)
            .rotate([90, 0, 0]);

        // Load external data and boot
        d3.json("uf.json").then((data: any) => {
            projection.precision(0)
                .rotate([90, 0, 0])
                .fitExtent(
                    [
                        [0, 0],
                        [this.props.width, this.props.height],
                    ],
                    data
                );
            let mouseOver = (d: any) => {
                let estado = d.target.__data__.properties.NOME_UF;
                svg.selectAll("." + estado.replaceAll(' ', ''))
                    .attr("fill", "#1dcf58");

                d3.select(".tooltip-container")
                    .style("opacity", 1)
                    .style("z-index", 1000);

                d3.select(".tooltip-container")
                    .style("transform", "scale(1,1)");
                d3.select(".tooltip")
                    .html(d.target.__data__.properties.NOME_UF);
            };

            let mouseMove = (d: any) => {

                d3.select(".tooltip-container")
                    .style("-webkit-transition-property", "none")
                    .style("-moz-transition-property", "none")
                    .style("-o-transition-property", "none")
                    .style("transition-property", "none")
                    .style("left", (d.pageX + 10) + "px")
                    .style("top", (d.pageY - 30) + "px");
                d3.select(".tooltip")
                    .html(d.target.__data__.properties.NOME_UF);
            };

            let mouseLeave = (d: any) => {
                let estado = d.target.__data__.properties.NOME_UF;
                if (estado !== this.state.estadoSelecionado) {
                    svg.selectAll("." + estado.replaceAll(' ', ''))
                        .attr("fill", "#69b3a2");
                }
                d3.selectAll(".tooltip-container")
                    .style("opacity", 0)
                    .style("z-index", -1000)
                    .style("transform", "scale(0.1,0.1)")
                    .style("transition", "all .2s ease-in-out");
            };

            let mouseClick = (d: any) => {
                svg.selectAll(".estado")
                    .attr("fill", "#69b3a2");
                let estado = d.target.__data__.properties.NOME_UF;
                svg.selectAll("." + estado.replaceAll(' ', ''))
                    .attr("fill", "#1dcf58");
                this.setState({ estadoSelecionado: estado });
                this.props.estadoCallBack(d.target.__data__.properties.GEOCODIGO)
            };
            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(data.features)
                .enter().append("path")
                .attr("fill", "#69b3a2")
                .attr("cursor", "pointer")
                .attr("d", d3.geoPath().projection(projection) as any)
                .style("stroke", "#fff")
                .attr("class", (d: any) => { return "estado " + d.properties.NOME_UF.replaceAll(' ', ''); })
                .on("mouseover", mouseOver)
                .on("mousemove", mouseMove)
                .on("mouseleave", mouseLeave)
                .on("click", mouseClick);

        });
    }

    componentDidMount() {
        this.buildGraph();
    }

    render() {
        return (
            <div>
                <svg ref={(ref: SVGSVGElement) => this.ref = ref} width={this.props.width} height={this.props.height}></svg>
                <div className="tooltip-container">
                    <div className="tooltip"></div>
                </div>
            </div>);
    }
}

export default Mapa;