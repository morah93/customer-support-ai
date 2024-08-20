// npm install @pinecone-database/pinecone
import { Pinecone } from '@pinecone-database/pinecone'
import { OpenAI } from "langchain/llms";



const llm = new OpenAI();

const pc = new Pinecone({ apiKey: "YOUR_API_KEY" })
const index = pc.index("example-index")

await index.namespace('example-namespace').upsert([
  {
    id: 'vec1',
    values: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
    sparseValues: {
        indices: [1, 5],
        values: [0.5, 0.5]
    },
    metadata: {'genre': 'drama'},
  },
  {
    id: 'vec2',
    values: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
    metadata: {'genre': 'action'},
    sparseValues: {
        indices: [5, 6],
        values: [0.4, 0.5]
    }
  }
])

const embedder = new OpenAIEmbeddings({
  modelName: "gpt-3.5-turbo",
});

const documents = await Promise.all(
  pages.map((row) => {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 20,
    });
    const docs = splitter.splitDocuments([
      new Document({
        pageContent: row.text,
        metadata: {
          url: row.url,
          text: truncateStringByBytes(row.text, 35000),
        },
      }),
    ]);
    return docs;
  })
);
