const path = require("path")
const programDir = path.join(__dirname, "programs", "solana-summer")
const idlDir = path.join(__dirname, "idl")
const sdkDir = path.join(__dirname, "src", "generated")
const binaryInstallDir = path.join(__dirname, "..", ".crates")

module.exports = {
  idlGenerator: "anchor",
  programName: "solana_summer",
  programId: "8UBM18TuKwoTLR4cDB1fagGo1P1SpHPPwBRGcXgP1Utr",
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
}
