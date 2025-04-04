// formations.js
export const formations = {
"4-3-3": {
    name: "4-3-3 (Attack)",
    positions: {
      // Titulari
      ST: { top: "50%", left: "85%" },
      LW: { top: "20%", left: "75%" },
      RW: { top: "80%", left: "75%" },
      CM1: { top: "35%", left: "60%" },
      CM2: { top: "50%", left: "60%" },
      CM3: { top: "65%", left: "60%" },
      LB: { top: "20%", left: "35%" },
      CB1: { top: "40%", left: "35%" },
      CB2: { top: "60%", left: "35%" },
      RB: { top: "80%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST: "ST", LW: "LW", RW: "RW", 
      CM1: "CAM", CM2: "CM", CM3: "CDM", 
      LB: "LB", CB1: "CB", CB2: "CB", RB: "RB", GK: "GK"
    },
    positionMapping: {
      "ST": ["ST", "CF"],
      "LW": ["LW", "LM"],
      "RW": ["RW", "RM"],
      "CM1": ["CAM", "CM"],
      "CM2": ["CM"],
      "CM3": ["CDM", "CM"],
      "LB": ["LB"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "RB": ["RB"],
      "GK": ["GK"]
    }
  },
  "4-4-2": {
    name: "4-4-2 (Classic)",
    positions: {
      // Titulari
      ST1: { top: "35%", left: "85%" },
      ST2: { top: "65%", left: "85%" },
      LM: { top: "20%", left: "60%" },
      CM1: { top: "40%", left: "60%" },
      CM2: { top: "60%", left: "60%" },
      RM: { top: "80%", left: "60%" },
      LB: { top: "20%", left: "35%" },
      CB1: { top: "40%", left: "35%" },
      CB2: { top: "60%", left: "35%" },
      RB: { top: "80%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST1: "ST", ST2: "ST", LM: "LM", RM: "RM", 
      CM1: "CM", CM2: "CM", 
      LB: "LB", CB1: "CB", CB2: "CB", RB: "RB", GK: "GK"
    },
    positionMapping: {
      "ST1": ["ST", "CF"],
      "ST2": ["ST", "CF"],
      "LM": ["LM", "LW"],
      "RM": ["RM", "RW"],
      "CM1": ["CM", "CDM"],
      "CM2": ["CM", "CDM"],
      "LB": ["LB"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "RB": ["RB"],
      "GK": ["GK"]
    }
  },
  "4-2-3-1": {
    name: "4-2-3-1 (Wide)",
    positions: {
      // Titulari
      ST: { top: "50%", left: "85%" },
      CAM: { top: "50%", left: "70%" },
      LM: { top: "20%", left: "70%" },
      RM: { top: "80%", left: "70%" },
      CDM1: { top: "35%", left: "55%" },
      CDM2: { top: "65%", left: "55%" },
      LB: { top: "20%", left: "35%" },
      CB1: { top: "40%", left: "35%" },
      CB2: { top: "60%", left: "35%" },
      RB: { top: "80%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST: "ST", CAM: "CAM", LM: "LM", RM: "RM", 
      CDM1: "CDM", CDM2: "CDM", 
      LB: "LB", CB1: "CB", CB2: "CB", RB: "RB", GK: "GK"
    },
    positionMapping: {
      "ST": ["ST", "CF"],
      "CAM": ["CAM", "CM"],
      "LM": ["LM", "LW"],
      "RM": ["RM", "RW"],
      "CDM1": ["CDM", "CM"],
      "CDM2": ["CDM", "CM"],
      "LB": ["LB"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "RB": ["RB"],
      "GK": ["GK"]
    }
  },
  "3-5-2": {
    name: "3-5-2",
    positions: {
      // Titulari
      ST1: { top: "35%", left: "85%" },
      ST2: { top: "65%", left: "85%" },
      CAM: { top: "50%", left: "70%" },
      LM: { top: "20%", left: "60%" },
      CM1: { top: "50%", left: "55%" },
      RM: { top: "80%", left: "60%" },
      CDM: { top: "50%", left: "45%" },
      CB1: { top: "30%", left: "35%" },
      CB2: { top: "50%", left: "30%" },
      CB3: { top: "70%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST1: "ST", ST2: "ST", CAM: "CAM", LM: "LM", RM: "RM", 
      CM1: "CM", CDM: "CDM", 
      CB1: "CB", CB2: "CB", CB3: "CB", GK: "GK"
    },
    positionMapping: {
      "ST1": ["ST", "CF"],
      "ST2": ["ST", "CF"],
      "CAM": ["CAM", "CM"],
      "LM": ["LM", "LW", "LB"],
      "RM": ["RM", "RW", "RB"],
      "CM1": ["CM"],
      "CDM": ["CDM", "CM"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "CB3": ["CB"],
      "GK": ["GK"]
    }
  },
  "5-3-2": {
    name: "5-3-2 (Defensive)",
    positions: {
      // Titulari
      ST1: { top: "35%", left: "85%" },
      ST2: { top: "65%", left: "85%" },
      CM1: { top: "30%", left: "65%" },
      CM2: { top: "50%", left: "60%" },
      CM3: { top: "70%", left: "65%" },
      LWB: { top: "15%", left: "45%" },
      RWB: { top: "85%", left: "45%" },
      CB1: { top: "30%", left: "35%" },
      CB2: { top: "50%", left: "30%" },
      CB3: { top: "70%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST1: "ST", ST2: "ST", 
      CM1: "CM", CM2: "CM", CM3: "CM", 
      LWB: "LWB", RWB: "RWB", 
      CB1: "CB", CB2: "CB", CB3: "CB", GK: "GK"
    },
    positionMapping: {
      "ST1": ["ST", "CF"],
      "ST2": ["ST", "CF"],
      "CM1": ["CM", "CAM"],
      "CM2": ["CM", "CDM"],
      "CM3": ["CM", "CAM"],
      "LWB": ["LB", "LM", "LW"],
      "RWB": ["RB", "RM", "RW"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "CB3": ["CB"],
      "GK": ["GK"]
    }
  },
  "4-1-2-1-2": {
    name: "4-1-2-1-2 (Diamond)",
    positions: {
      // Titulari
      ST1: { top: "35%", left: "85%" },
      ST2: { top: "65%", left: "85%" },
      CAM: { top: "50%", left: "70%" },
      CM1: { top: "30%", left: "60%" },
      CM2: { top: "70%", left: "60%" },
      CDM: { top: "50%", left: "50%" },
      LB: { top: "20%", left: "35%" },
      CB1: { top: "40%", left: "35%" },
      CB2: { top: "60%", left: "35%" },
      RB: { top: "80%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST1: "ST", ST2: "ST", CAM: "CAM", 
      CM1: "CM", CM2: "CM", CDM: "CDM", 
      LB: "LB", CB1: "CB", CB2: "CB", RB: "RB", GK: "GK"
    },
    positionMapping: {
      "ST1": ["ST", "CF"],
      "ST2": ["ST", "CF"],
      "CAM": ["CAM", "CM"],
      "CM1": ["CM", "LM"],
      "CM2": ["CM", "RM"],
      "CDM": ["CDM", "CM"],
      "LB": ["LB"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "RB": ["RB"],
      "GK": ["GK"]
    }
  },
  "3-4-3": {
    name: "3-4-3 (Attack)",
    positions: {
      // Titulari
      ST: { top: "50%", left: "85%" },
      LW: { top: "20%", left: "75%" },
      RW: { top: "80%", left: "75%" },
      LM: { top: "20%", left: "55%" },
      CM1: { top: "40%", left: "55%" },
      CM2: { top: "60%", left: "55%" },
      RM: { top: "80%", left: "55%" },
      CB1: { top: "30%", left: "35%" },
      CB2: { top: "50%", left: "30%" },
      CB3: { top: "70%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST: "ST", LW: "LW", RW: "RW", 
      LM: "LM", RM: "RM", CM1: "CM", CM2: "CM", 
      CB1: "CB", CB2: "CB", CB3: "CB", GK: "GK"
    },
    positionMapping: {
      "ST": ["ST", "CF"],
      "LW": ["LW", "LM"],
      "RW": ["RW", "RM"],
      "LM": ["LM", "LB"],
      "RM": ["RM", "RB"],
      "CM1": ["CM", "CDM"],
      "CM2": ["CM", "CDM"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "CB3": ["CB"],
      "GK": ["GK"]
    }
  },
  "4-5-1": {
    name: "4-5-1 (Flat)",
    positions: {
      // Titulari
      ST: { top: "50%", left: "85%" },
      LM: { top: "15%", left: "65%" },
      CM1: { top: "35%", left: "65%" },
      CM2: { top: "50%", left: "60%" },
      CM3: { top: "65%", left: "65%" },
      RM: { top: "85%", left: "65%" },
      LB: { top: "20%", left: "35%" },
      CB1: { top: "40%", left: "35%" },
      CB2: { top: "60%", left: "35%" },
      RB: { top: "80%", left: "35%" },
      GK: { top: "50%", left: "15%" },
    },
    positionNames: {
      ST: "ST", LM: "LM", RM: "RM", 
      CM1: "CM", CM2: "CM", CM3: "CM", 
      LB: "LB", CB1: "CB", CB2: "CB", RB: "RB", GK: "GK"
    },
    positionMapping: {
      "ST": ["ST", "CF"],
      "LM": ["LM", "LW"],
      "RM": ["RM", "RW"],
      "CM1": ["CM", "CAM"],
      "CM2": ["CM", "CDM"],
      "CM3": ["CM", "CAM"],
      "LB": ["LB"],
      "CB1": ["CB"],
      "CB2": ["CB"],
      "RB": ["RB"],
      "GK": ["GK"]
    }
  }
};