"use client";

import { useEffect, useRef, useState } from "react";

export default function SvgMap({ onRegionClick }) {
  const svgRef = useRef(null);
  const [totalDisasters, setTotalDisasters] = useState(0);
  const [recentDisaster, setRecentDisaster] = useState(null);

  useEffect(() => {
    const disasterByRegion = {};
    const disasterDetailByRegion = {};

    function showTooltip(x, y, html) {
      const tip = document.getElementById("tooltip");
      tip.innerHTML = html;
      tip.style.left = x + 10 + "px";
      tip.style.top = y + 10 + "px";
      tip.style.display = "block";
    }

    function hideTooltip() {
      document.getElementById("tooltip").style.display = "none";
    }

    document.body.addEventListener("click", (e) => {
      if (!e.target.closest("path")) {
        hideTooltip();
      }
    });

    function fetchDisasterData() {
      return fetch("/api/laporan")
        .then((res) => res.json())
        .then((data) => {
          if (!data || !data.records) {
            console.error("Invalid API response:", data);
            return;
          }

          const currentYear = new Date().getFullYear();
          const filtered = data.records.filter((r) => {
            const tgl = r.fields["Tanggal Bencana"];
            return tgl && new Date(tgl).getFullYear() === currentYear;
          });

          // Set total disasters count
          setTotalDisasters(filtered.length);

          // Find most recent disaster
          const sortedByDate = filtered.sort((a, b) => {
            const dateA = new Date(a.fields["Tanggal Bencana"]);
            const dateB = new Date(b.fields["Tanggal Bencana"]);
            return dateB - dateA;
          });

          if (sortedByDate.length > 0) {
            const recent = sortedByDate[0].fields;
            setRecentDisaster({
              date: recent["Tanggal Bencana"],
              location: recent["Kabupaten/Kota"] || "Unknown",
              type: recent["Jenis Bencana"] || "Unknown",
              district: recent["Kecamatan"] || "Unknown",
              subdistrict: recent["Desa/Kelurahan"] || "Unknown"
            });
          }

          const tempMap = {};
          const detailMap = {};

          filtered.forEach((r) => {
            const kab = (r.fields["Kabupaten/Kota"] || "").trim();
            const type = r.fields["Jenis Bencana"];
            if (!kab || !type) return;

            tempMap[kab] = tempMap[kab] || { count: 0, types: {} };
            detailMap[kab] = detailMap[kab] || [];

            tempMap[kab].count++;
            tempMap[kab].types[type] =
              (tempMap[kab].types[type] || 0) + 1;
            detailMap[kab].push(r.fields);
          });

          for (const kab in tempMap) {
            const types = tempMap[kab].types;
            const dominant = Object.keys(types).sort(
              (a, b) => types[b] - types[a]
            )[0];
            disasterByRegion[kab] = {
              count: tempMap[kab].count,
              dominant,
            };
            disasterDetailByRegion[kab] = detailMap[kab];
          }
        });
    }

    function renderMap(features) {
      const svg = svgRef.current;
      svg.innerHTML = "";

      // Create defs for filters and gradients
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

      // Drop shadow filter
      const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
      filter.setAttribute("id", "drop-shadow");
      filter.setAttribute("x", "-50%");
      filter.setAttribute("y", "-50%");
      filter.setAttribute("width", "200%");
      filter.setAttribute("height", "200%");

      const feDropShadow = document.createElementNS("http://www.w3.org/2000/svg", "feDropShadow");
      feDropShadow.setAttribute("dx", "2");
      feDropShadow.setAttribute("dy", "2");
      feDropShadow.setAttribute("stdDeviation", "3");
      feDropShadow.setAttribute("flood-color", "rgba(0, 0, 0, 0.3)");

      filter.appendChild(feDropShadow);
      defs.appendChild(filter);

      // Inner shadow filter for hover effect
      const innerShadowFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
      innerShadowFilter.setAttribute("id", "inner-shadow");
      innerShadowFilter.setAttribute("x", "-50%");
      innerShadowFilter.setAttribute("y", "-50%");
      innerShadowFilter.setAttribute("width", "200%");
      innerShadowFilter.setAttribute("height", "200%");

      const feOffset = document.createElementNS("http://www.w3.org/2000/svg", "feOffset");
      feOffset.setAttribute("dx", "0");
      feOffset.setAttribute("dy", "0");

      const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
      feGaussianBlur.setAttribute("stdDeviation", "3");
      feGaussianBlur.setAttribute("result", "offset-blur");

      const feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
      feFlood.setAttribute("flood-color", "rgba(0, 0, 0, 0.4)");

      const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
      feComposite.setAttribute("in2", "offset-blur");
      feComposite.setAttribute("operator", "in");

      const feMerge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
      const feMergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
      const feMergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
      feMergeNode2.setAttribute("in", "SourceGraphic");

      feMerge.appendChild(feMergeNode1);
      feMerge.appendChild(feMergeNode2);

      innerShadowFilter.appendChild(feOffset);
      innerShadowFilter.appendChild(feGaussianBlur);
      innerShadowFilter.appendChild(feFlood);
      innerShadowFilter.appendChild(feComposite);
      innerShadowFilter.appendChild(feMerge);
      defs.appendChild(innerShadowFilter);

      svg.appendChild(defs);

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

      features.forEach((feature) => {
        let coordsArray = [];

        if (feature.geometry.type === "Polygon") {
          coordsArray = [feature.geometry.coordinates];
        } else if (feature.geometry.type === "MultiPolygon") {
          coordsArray = feature.geometry.coordinates;
        }

        coordsArray.forEach((polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              minX = Math.min(minX, coord[0]);
              maxX = Math.max(maxX, coord[0]);
              minY = Math.min(minY, coord[1]);
              maxY = Math.max(maxY, coord[1]);
            });
          });
        });
      });

      const width = 650;
      const height = 500;
      const mapWidth = maxX - minX;
      const mapHeight = maxY - minY;

      const scale = Math.min(width / mapWidth, height / mapHeight);
      const dx = (width - mapWidth * scale) / 2;
      const dy = (height - mapHeight * scale) / 2;

      // Create groups for better layer management
      const pathGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      pathGroup.setAttribute("id", "paths");
      const textGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      textGroup.setAttribute("id", "texts");

      svg.appendChild(pathGroup);
      svg.appendChild(textGroup);

      // Store text elements for repositioning
      const textElements = new Map();

      features.forEach((feature) => {
        let coordsArray = [];

        if (feature.geometry.type === "Polygon") {
          coordsArray = [feature.geometry.coordinates];
        } else if (feature.geometry.type === "MultiPolygon") {
          coordsArray = feature.geometry.coordinates;
        }

        const regionName =
          feature.properties.kabkot?.trim() ||
          feature.properties.NAME_2?.trim() ||
          "Unknown";

        const summary =
          disasterByRegion[regionName] || {
            count: 0,
            dominant: "Tidak ada",
          };

        const details =
          disasterDetailByRegion[regionName] || [];

        let fillColor, strokeColor;
        if (summary.count > 7) {
          fillColor = "#1e40af"; // Blue 800
          strokeColor = "#1e3a8a"; // Blue 900
        } else if (summary.count > 4) {
          fillColor = "#3b82f6"; // Blue 500
          strokeColor = "#2563eb"; // Blue 600
        } else if (summary.count > 1) {
          fillColor = "#60a5fa"; // Blue 400
          strokeColor = "#3b82f6"; // Blue 500
        } else {
          fillColor = "#93c5fd"; // Blue 300
          strokeColor = "#60a5fa"; // Blue 400
        }

        coordsArray.forEach((polygon) => {
          const pathData = polygon
            .map((ring) => {
              return ring
                .map((coord, i) => {
                  const x =
                    (coord[0] - minX) * scale + dx;
                  const y =
                    height -
                    (coord[1] - minY) * scale -
                    dy;
                  return `${i === 0 ? "M" : "L"}${x} ${y}`;
                })
                .join(" ") + " Z";
            })
            .join(" ");

          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute("d", pathData);
          path.setAttribute("fill", fillColor);
          path.setAttribute("stroke", strokeColor);
          path.setAttribute("stroke-width", "1");
          path.setAttribute("data-name", regionName);
          path.setAttribute("filter", "url(#drop-shadow)");

          // Add CSS classes for styling
          path.style.cursor = "pointer";
          path.style.transition = "all 0.3s ease";

          // Store original colors for hover effect
          path.setAttribute("data-original-fill", fillColor);
          path.setAttribute("data-original-stroke", strokeColor);

          path.addEventListener("mouseover", (e) => {
            // Apply hover effects
            path.setAttribute("filter", "url(#inner-shadow)");
            path.style.transform = "scale(1.02)";
            path.style.transformOrigin = "center";

            // Lighten the color on hover
            const hoverFill = lightenColor(fillColor, 20);
            const hoverStroke = lightenColor(strokeColor, 20);
            path.setAttribute("fill", hoverFill);
            path.setAttribute("stroke", hoverStroke);
            path.setAttribute("stroke-width", "2");

            // Move path to front within its group, but keep text group on top
            pathGroup.appendChild(path);

            // Ensure text group is always on top
            svg.appendChild(textGroup);

            // Show tooltip on hover
            showTooltip(
              e.pageX,
              e.pageY,
              `<strong>${regionName}</strong><br>
            ${summary.count} kejadian<br>
            Dominan: ${summary.dominant}`
            );
          });

          path.addEventListener("mouseout", () => {
            // Reset to original state
            path.setAttribute("filter", "url(#drop-shadow)");
            path.style.transform = "scale(1)";
            path.setAttribute("fill", path.getAttribute("data-original-fill"));
            path.setAttribute("stroke", path.getAttribute("data-original-stroke"));
            path.setAttribute("stroke-width", "1");
            hideTooltip();
          });

          // Optional: Keep mousemove for tooltip position tracking
          path.addEventListener("mousemove", (e) => {
            showTooltip(
              e.pageX,
              e.pageY,
              `<strong>${regionName}</strong><br>
            ${summary.count} kejadian<br>
            Dominan: ${summary.dominant}`
            );
          });

          pathGroup.appendChild(path);
        });
      });

      // Add region labels after all paths are rendered
      features.forEach((feature) => {
        let coordsArray = [];
      
        if (feature.geometry.type === "Polygon") {
          coordsArray = [feature.geometry.coordinates];
        } else if (feature.geometry.type === "MultiPolygon") {
          coordsArray = feature.geometry.coordinates;
        }
      
        const regionName =
          feature.properties.kabkot?.trim() ||
          feature.properties.NAME_2?.trim() ||
          "Unknown";
      
        const summary =
          disasterByRegion[regionName] || {
            count: 0,
            dominant: "Tidak ada",
          };
      
        const details =
          disasterDetailByRegion[regionName] || [];
      
        let fillColor, strokeColor;
        if (summary.count > 7) {
          fillColor = "#1e40af"; // Blue 800
          strokeColor = "#1e3a8a"; // Blue 900
        } else if (summary.count > 4) {
          fillColor = "#3b82f6"; // Blue 500
          strokeColor = "#2563eb"; // Blue 600
        } else if (summary.count > 1) {
          fillColor = "#60a5fa"; // Blue 400
          strokeColor = "#3b82f6"; // Blue 500
        } else {
          fillColor = "#93c5fd"; // Blue 300
          strokeColor = "#60a5fa"; // Blue 400
        }
      
        coordsArray.forEach((polygon) => {
          const pathData = polygon
            .map((ring) => {
              return ring
                .map((coord, i) => {
                  const x = (coord[0] - minX) * scale + dx;
                  const y = height - (coord[1] - minY) * scale - dy;
                  return `${i === 0 ? "M" : "L"}${x} ${y}`;
                })
                .join(" ") + " Z";
            })
            .join(" ");
      
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", pathData);
          path.setAttribute("fill", fillColor);
          path.setAttribute("stroke", strokeColor);
          path.setAttribute("stroke-width", "1");
          path.setAttribute("data-name", regionName);
          path.setAttribute("filter", "url(#drop-shadow)");
          path.style.cursor = "pointer";
          path.style.transition = "all 0.3s ease";
          path.setAttribute("data-original-fill", fillColor);
          path.setAttribute("data-original-stroke", strokeColor);
      
          // ✅ EVENT: Hover tooltip
          path.addEventListener("mouseover", (e) => {
            path.setAttribute("filter", "url(#inner-shadow)");
            path.style.transform = "scale(1.02)";
            path.style.transformOrigin = "center";
      
            const hoverFill = lightenColor(fillColor, 20);
            const hoverStroke = lightenColor(strokeColor, 20);
            path.setAttribute("fill", hoverFill);
            path.setAttribute("stroke", hoverStroke);
            path.setAttribute("stroke-width", "2");
      
            pathGroup.appendChild(path);
            svg.appendChild(textGroup); // Keep texts on top
      
            showTooltip(
              e.pageX,
              e.pageY,
              `<strong>${regionName}</strong><br>
              ${summary.count} kejadian<br>
              Dominan: ${summary.dominant}`
            );
          });
      
          path.addEventListener("mouseout", () => {
            path.setAttribute("filter", "url(#drop-shadow)");
            path.style.transform = "scale(1)";
            path.setAttribute("fill", path.getAttribute("data-original-fill"));
            path.setAttribute("stroke", path.getAttribute("data-original-stroke"));
            path.setAttribute("stroke-width", "1");
            hideTooltip();
          });
      
          path.addEventListener("mousemove", (e) => {
            showTooltip(
              e.pageX,
              e.pageY,
              `<strong>${regionName}</strong><br>
              ${summary.count} kejadian<br>
              Dominan: ${summary.dominant}`
            );
          });
      
          // ✅ EVENT: Klik wilayah
          path.addEventListener("click", () => {
            if (typeof onRegionClick === "function") {
              onRegionClick(regionName, details);
            }
          });
      
          pathGroup.appendChild(path);
        });
      });

      features.forEach((feature) => {
        let coordsArray = [];

        if (feature.geometry.type === "Polygon") {
          coordsArray = [feature.geometry.coordinates];
        } else if (feature.geometry.type === "MultiPolygon") {
          coordsArray = feature.geometry.coordinates;
        }

        const regionName =
          feature.properties.kabkot?.trim() ||
          feature.properties.NAME_2?.trim() ||
          "Unknown";

        // Calculate centroid for label placement
        let totalX = 0, totalY = 0, pointCount = 0;

        coordsArray.forEach((polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => {
              const x = (coord[0] - minX) * scale + dx;
              const y = height - (coord[1] - minY) * scale - dy;
              totalX += x;
              totalY += y;
              pointCount++;
            });
          });
        });

        const centroidX = totalX / pointCount;
        const centroidY = totalY / pointCount;

        // Advanced positioning logic
        let finalX = centroidX;
        let finalY = centroidY;

        // Special cases for oddly shaped regions
        if (regionName === "Lampung Barat") {
          finalX = centroidX + 70;
          finalY = centroidY + 20;
        } 
        if (regionName === "Tanggamus") {
          finalX = centroidX - 20;
          finalY = centroidY - 60;
        }
        if (regionName === "Pesisir Barat") {
          finalX = centroidX - 15;
        }
        if (regionName === "Pringsewu") {
          finalX = centroidX + 5;
        }
        if (regionName === "Pesawaran") {
          finalX = centroidX - 10;
          finalY = centroidY + 10;
        }
        if (regionName === "Lampung Selatan") {
          finalY = centroidY - 10;
        }
        if (regionName === "Lampung Timur") {
          finalX = centroidX + 10;
          finalY = centroidY + 10;
        }
        if (regionName === "Bandar Lampung") {
          finalX = centroidX - 5;
          finalY = centroidY - 5;
        }
        if (regionName === "Tulang Bawang") {
          finalY = centroidY - 10;
        }
        if (regionName === "Tulang Bawang Barat") {
          finalX = centroidX + 5;
          finalY = centroidY + 15;
        }
        if (regionName === "Way Kanan") {
          finalX = centroidX - 25;
          finalY = centroidY - 10;
        }
        if (regionName === "Mesuji") {
          finalX = centroidX - 10;
          finalY = centroidY - 7;
        }

        // Create text element for region name
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", finalX);
        text.setAttribute("y", finalY);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("font-family", "'Segoe UI', sans-serif");
        text.setAttribute("font-size", "10");
        text.setAttribute("font-weight", "600");
        text.setAttribute("fill", "#1e3a8a");
        text.setAttribute("stroke", "#ffffff");
        text.setAttribute("stroke-width", "0.5");
        text.setAttribute("paint-order", "stroke");
        text.style.pointerEvents = "none";
        text.style.userSelect = "none";

        // Split long names into multiple lines
        const words = regionName.split(' ');
        if (words.length > 1 && regionName.length > 12) {
          const tspan1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          const tspan2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

          tspan1.setAttribute("x", finalX);
          tspan1.setAttribute("dy", "-5");
          tspan1.textContent = words.slice(0, Math.ceil(words.length / 2)).join(' ');

          tspan2.setAttribute("x", finalX);
          tspan2.setAttribute("dy", "10");
          tspan2.textContent = words.slice(Math.ceil(words.length / 2)).join(' ');

          text.appendChild(tspan1);
          text.appendChild(tspan2);
        } else {
          text.textContent = regionName;
        }

        textGroup.appendChild(text);
        textElements.set(regionName, text);
      });
      
    }

    // Helper function to lighten colors
    function lightenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const G = (num >> 8 & 0x00FF) + amt;
      const B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    Promise.all([
      fetch("/data/geojson-lampung.json").then((r) => r.json()),
      fetchDisasterData(),
    ]).then(([geoData]) => {
      renderMap(geoData.features);
    });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Tidak diketahui";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  // Styles matching the glassmorphic theme
  const mainStyle = {
  };

  const containerStyle = {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(15px)",
    borderRadius: "20px",
    padding: "30px 30px 30px 0",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    display: "flex",
    width: "1134px",
    gap: "20px",
  };

  const leftSideStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minWidth: "500px",
  };

  const legendStyle = {
    display: "flex",
    width: "400px",
    justifyContent: "center",
    marginBottom: "20px",
    gap: "15px",
    flexWrap: "wrap",
    color: "#FFFFFF",
  };

  const legendItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: "500",
    color: "white",
  };

  const legendColorStyle = {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const mapContainerStyle = {
    background: "rgba(255, 255, 255, 0)",
    backdropFilter: "",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0)",
  };

  const rightSideStyle = {
    width: "280px",
    background: "rgba(255, 255, 255, 0)",
    backdropFilter: "",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255, 255, 255, 0)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    minHeight: "500px",
    textAlign: "left",
    gap: "30px",
  };

  const sectionHeaderStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "4px",
  };

  const sectionSubtitleStyle = {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.8)",
  };

  const bigNumberStyle = {
    fontSize: "110px",
    fontWeight: "700",
    lineHeight: "1",
    color: "#ffffff",
    textShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
  };

  const bigTextStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
    marginTop: "8px",
  };

  const alertBadgeStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#FFEB3B",
    marginBottom: "12px",
    textAlign: "left",
  };

  const recentDisasterTextStyle = {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: "1.5",
  };

  const highlightStyle = {
    fontWeight: "600",
    color: "#ffffff",
  };

  const tooltipStyle = {
    position: "absolute",
    display: "none",
    background: "rgb(255, 255, 255)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "12px 16px",
    borderRadius: "12px",
    pointerEvents: "none",
    fontSize: "14px",
    color: "#093FB4",
    zIndex: 1000,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    lineHeight: "1.4",
    fontWeight: "500",
    maxWidth: "200px",
  };

  const legendItems = [
    { color: "#93c5fd", label: "0-1 kejadian" },
    { color: "#60a5fa", label: "2-4 kejadian" },
    { color: "#3b82f6", label: "4-7 kejadian" },
    { color: "#1e40af", label: "> 7 kejadian" },
  ];
  
  return (
    <div style={mainStyle}>
      {/* Main Container */}
      <div style={containerStyle}>
        {/* Left Side - Legend and Map */}
        <div style={leftSideStyle}>
          {/* Legend */}
          <div style={legendStyle}>
            {legendItems.map((item) => (
              <div key={item.label} style={legendItemStyle}>
                <div
                  style={{
                    ...legendColorStyle,
                    backgroundColor: item.color,
                  }}
                />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Map Container */}
          <div style={mapContainerStyle}>
            <svg
              ref={svgRef}
              width={610}
              height={460}
              style={{
                borderRadius: "8px",
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0)",
              }}
            />
          </div>
        </div>

        {/* Right Side - Statistics */}
        <div style={rightSideStyle}>
          {/* SECTION 1 - TOP */}
          <div>
            <h3 style={sectionHeaderStyle}>
              Countdown Disaster
            </h3>
            <p style={sectionSubtitleStyle}>
              Perhitungan dalam satu tahun
            </p>
          </div>

          {/* SECTION 2 - CENTER */}
          <div>
            <div style={bigNumberStyle}>
              {totalDisasters}
            </div>
            <p style={bigTextStyle}>
              Kejadian Bencana
            </p>
          </div>

          {/* SECTION 3 - BOTTOM */}
          <div>
            {recentDisaster ? (
              <>
                <div style={alertBadgeStyle}>
                  Baru Terjadi !!!
                </div>
                <p style={recentDisasterTextStyle}>
                  <span style={highlightStyle}>{recentDisaster.type}</span>, di{" "}
                  <span style={highlightStyle}>{recentDisaster.location}</span>, Kecamatan{" "}
                  <span style={highlightStyle}>
                    {recentDisaster.district || "Unknown"}
                  </span>, Kelurahan{" "}
                  <span style={highlightStyle}>
                    {recentDisaster.subdistrict || "Unknown"}
                  </span>, pada tanggal{" "}
                  <span style={highlightStyle}>
                    {formatDate(recentDisaster.date)}
                  </span>.
                </p>
              </>
            ) : (
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.6)",
                  fontStyle: "italic",
                }}
              >
                Belum ada data bencana terbaru
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Tooltip */}
      <div
        id="tooltip"
        style={tooltipStyle}
      />
    </div>
    
  );

  

}