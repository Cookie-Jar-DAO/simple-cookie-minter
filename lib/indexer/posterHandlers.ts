import { Rating, Reason, db } from "./db";
import { PublicClient } from "viem";

export const postHandler = async (
  user: string,
  tag: string,
  data: string,
  publicClient: PublicClient,
) => {
  const parsedContent = await processPosterContent(data, tag);
  console.log("Parsed Content: ", parsedContent);
};

// emit NewPost(msg.sender, content, tag);
const processPosterContent = async (content: string, tag: string) => {
  //TODO cleaner handling of parsing
  let parsedContent;

  //Try reason
  try {
    if (isReason(content)) {
      parsedContent = processReasonContent(content, tag);
      await db.reasons.put(parsedContent);
    }
  } catch (e) {
    console.log("Error: ", e);
  }

  //Try assess
  try {
    if (isAssessment(content)) {
      parsedContent = processAssessContent(content, tag);
      await db.ratings.put(parsedContent);
    }
  } catch (e) {
    console.log("Error: ", e);
  }

  return parsedContent;
};

const processReasonContent = (content: string, tag: string): Reason => {
  const parsedContent = JSON.parse(content);

  return {
    title: parsedContent.title,
    description: parsedContent.description,
    link: parsedContent.link,
    user: parsedContent.user,
    receiver: parsedContent.receiver,
    reasonTag: tag,
  };
};

const processAssessContent = (content: string, tag: string): Rating => {
  const parsedContent = content.split(" ");

  return {
    assessTag: tag,
    user: parsedContent[1],
    isGood: parsedContent[0] === "UP" ? true : false,
  };
};

const isReason = (content: any): content is Reason => {
  const parsedContent = JSON.parse(content);

  return typeof parsedContent.title === "string";
};

const isAssessment = (content: any): content is Rating => {
  //TODO validate on UP/DOWN and user
  return content.split(" ").length === 2;
};
