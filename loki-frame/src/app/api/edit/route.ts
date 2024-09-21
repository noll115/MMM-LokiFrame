import { PhotoData } from "@/app/edit/add/page";
import { addImg, deleteImg, getImagesNames } from "@/utils/ImageUtil";
import { NextResponse } from "next/server";
import { OutputInfo } from "sharp";

const SCREEN_WIDTH = 600;
const SCREEN_HEIGHT = 1024;

export const POST = async (req: Request) => {
  const files = (await req.json()) as PhotoData[];
  let waitingFiles: Promise<OutputInfo>[] = [];
  for (let file of files) {
    waitingFiles.push(addImg(file));
  }
  await Promise.all(waitingFiles);

  return new Response(null, { status: 200 });
};

export const DELETE = async (req: Request) => {
  let ids = (await req.json()) as string[];
  await Promise.all(ids.map((id) => deleteImg(id)));
  return NextResponse.json(await getImagesNames());
};
