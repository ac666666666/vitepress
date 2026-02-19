import {
  parse
} from "./chunk-WFG73FZF.js";
import "./chunk-D5DLI5ES.js";
import "./chunk-O6PDKUWC.js";
import "./chunk-ZR3TOOKP.js";
import "./chunk-RUJHKZ74.js";
import "./chunk-ECSIO6X5.js";
import "./chunk-M2I5AVG3.js";
import "./chunk-NIERM6ET.js";
import "./chunk-THDRMIC3.js";
import "./chunk-NHXG4Y7B.js";
import {
  package_default
} from "./chunk-TTGMFS66.js";
import {
  selectSvgElement
} from "./chunk-QMITNTQ3.js";
import {
  configureSvgSize
} from "./chunk-WUGW3Q67.js";
import {
  __name,
  log
} from "./chunk-YS36DYDD.js";
import "./chunk-2VRVB2MD.js";
import "./chunk-4UTD2NOI.js";
import "./chunk-BRWNSR25.js";
import "./chunk-U4QVH65B.js";
import "./chunk-MVEJMUOB.js";

// node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-HS3SLOUP.mjs
var parser = {
  parse: __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = {
  version: package_default.version + (true ? "" : "-tiny")
};
var getVersion = __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
//# sourceMappingURL=infoDiagram-HS3SLOUP-B6GXO43L.js.map
