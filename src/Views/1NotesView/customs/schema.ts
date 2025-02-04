import { Block, BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs } from "@blocknote/core";
import { Title } from "./blocks/noteTitle/Title";
import { Link1 } from "./inlines/links/Links";
// import { Mention } from "./inline/Mentions";
// import { Alert } from "./block/Alert";
// import { Link1 } from "./inline/Links/Links";
// import { Group1 } from "./inline/Group";
// import { Bot } from "./block/Bot";




export const schema = BlockNoteSchema.create({
    blockSpecs: {
      // enable the default blocks if desired
      ...defaultBlockSpecs,
      // Adds the Alert block.
      title: Title,
      //   bot:Bot
   
      // Add your own custom blocks:
      // customBlock: CustomBlock,
    },
    inlineContentSpecs: {
      // enable the default inline content if desired
      ...defaultInlineContentSpecs,
      link1:Link1,
    //   mention:Mention,
   
    //   group1:Group1
   
      // Add your own custom inline content:
      // customInlineContent: CustomInlineContent,
    },
    styleSpecs: {
      // enable the default styles if desired
      ...defaultStyleSpecs,
   
      // Add your own custom styles:
      // customStyle: CustomStyle
    },
});

export type NoteBlock = Block<
  typeof schema.blockSchema,
  typeof schema.inlineContentSchema,
  typeof schema.styleSchema
>;