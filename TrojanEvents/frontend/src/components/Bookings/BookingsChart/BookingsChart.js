import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BOOKINGS_BUCKET = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 1000000,
  },
};

const BookingsChart = (props) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartData = {
      labels: [],
      datasets: [],
    };

    for (const bucket in BOOKINGS_BUCKET) {
      const filteredBookingsCount = props.bookings.reduce((prev, current) => {
        if (
          current.event.price > BOOKINGS_BUCKET[bucket].min &&
          current.event.price < BOOKINGS_BUCKET[bucket].max
        ) {
          return prev + 1;
        } else {
          return prev;
        }
      }, 0);
      chartData.labels.push(bucket);
      chartData.datasets.push(filteredBookingsCount);
    }

    const margin = { top: 40, right: 20, bottom: 50, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(chartData.labels)
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear().domain([0, d3.max(chartData.datasets)]).range([height, 0]);

    const color = d3.scaleOrdinal().range(['#2196f3', '#4caf50', '#ff5722']);

    svg
      .selectAll('.bar')
      .data(chartData.datasets)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d, i) => x(chartData.labels[i]))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d))
      .attr('height', (d) => height - y(d))
      .attr('fill', (d, i) => color(i))
      .style('opacity', 0.8);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45)')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em')
      .attr('font-size', '12px');

    svg.append('g').call(d3.axisLeft(y));

    // Add chart title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Booking Count by Price Range');
  }, [props.bookings]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div
        style={{
          width: '400px',
          height: '200px',
          background: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '16px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Bookings Chart</h2>
        <div ref={chartRef}></div>
      </div>
    </div>
  );
};

export default BookingsChart;
