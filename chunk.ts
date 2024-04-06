import * as fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

const [, , fileLocation] = process.argv;

fs.readFile(fileLocation, "utf-8", (_, data) => {
  const smallChunks: string[] = data
    .split("\r\n")
    .filter((str) => (str === "" ? null : str));

  const bigChunks: string[] = [""];

  for (const s of smallChunks) {
    let bigChunkIndex = bigChunks.length - 1;

    if (bigChunks[bigChunkIndex].length + s.length > 3250) {
      bigChunks.push("");
      bigChunkIndex++;
    }

    bigChunks[bigChunkIndex] += "\r\n\r\n" + s;
  }

  const csvWriter = createObjectCsvWriter({
    path: fileLocation.replace(/\.txt$/, ".csv"),
    header: [
      { id: "index", title: "INDEX" },
      { id: "text", title: "TEXT" },
      { id: "index2", title: "INDEX2" },
      { id: "completedText", title: "COMPLETEDTEXT" },
    ],
  });

  type RecordType = {
    index: string;
    text: string;
    index2: string;
    completedText: string;
  };

  const records: RecordType[] = bigChunks.map((c, i) => ({
    index: `${i + 1}`,
    text: c.trim(),
    index2: `${i + 1}`,
    completedText: "",
  }));

  csvWriter.writeRecords(records);
});
