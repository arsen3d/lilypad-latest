// It is important that you only import types from @ironclad/rivet-core, and not
// any of the actual Rivet code. Rivet is passed into the initializer function as
// a parameter, and you can use it to access any Rivet functionality you need.
import type { RivetPlugin, RivetPluginInitializer } from "../node_modules/@ironclad/rivet-core/dist/types/index.js";

import { examplePluginNode } from "./nodes/ExamplePluginNode.js";
import { cowsayPluginNode } from "./nodes/CowsayPluginNode.js";
import { searchAgentPluginNode } from "./nodes/SearchAgentPluginNode.js";
import { paperReaderAgentPluginNode } from "./nodes/PaperReaderAgentPluginNode.js";
import { oncologistAgentPluginNode } from "./nodes/OncologistAgentPluginNode.js";
import { proteinDesignerAgentPluginNode } from "./nodes/ProteinDesignerAgentPluginNode.js";
import { gradioPluginNode } from "./nodes/GradioPluginNode";
import { agentPluginNode } from "./nodes/AgentPluginNode";
import { mediaPluginNode } from "./nodes/MediaPluginNode";
import { ipfsPluginNode } from "./nodes/IpfsPluginNode";
import { walletPluginNode } from "./nodes/WalletPluginNode";
import { realtimeagentPluginNode } from "./nodes/RealtimeAgentPluginNode";
import { modulePluginNode } from "./nodes/ModulePluginNode.js";
// A Rivet plugin must default export a plugin initializer function. This takes in the Rivet library as its
// only parameter. This function must return a valid RivetPlugin object.
const plugin: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const exampleNode = examplePluginNode(rivet);
  const cowsayNode = cowsayPluginNode(rivet);
  const searchNode = searchAgentPluginNode(rivet);
  const readerNode = paperReaderAgentPluginNode(rivet);
  const oncologistNode = oncologistAgentPluginNode(rivet);
  const proteinDesignerNode = proteinDesignerAgentPluginNode(rivet);
  const gradionNode = gradioPluginNode(rivet);
  const agentNode = agentPluginNode(rivet);
  const mediaNode = mediaPluginNode(rivet);
  const ipfsNode = ipfsPluginNode(rivet);
  const walletsNode = walletPluginNode(rivet);
  const realtimeagentNode  = realtimeagentPluginNode(rivet);
  const moduleNode  = modulePluginNode(rivet);
  
  // The plugin object is the definition for your plugin.
  const lilypadRivetPlugin: RivetPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "lilypad-rivet",

    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Lilypad Plugin",

    // Define all configuration settings in the configSpec object.
    configSpec: {
      sk: {
        type: "string",
        label: "Secret Key",
        description: "Paste in your secret key.",
        helperText: "Paste in your secret key.",
      },
      api: {
        type: "string",
        label: "Api",
        description: "Paste in your api url.",
        helperText: "Paste in your api url.",
      },
    },

    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "lilypad",
        label: "Lilypad",
      },
      {
        id: "bioml",
        label: "BioMl",
      },
    ],

    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(exampleNode);
      register(cowsayNode);
      register(searchNode);
      register(readerNode);
      register(oncologistNode);
      register(proteinDesignerNode);
      register(gradionNode);
      register(agentNode);
      register(mediaNode);
      register(ipfsNode);
      register(walletsNode);
      register(realtimeagentNode);
      register(moduleNode);
      
    },
  };

  // Make sure to return your plugin definition.
  return lilypadRivetPlugin;
};

// Make sure to default export your plugin.
export default plugin;
