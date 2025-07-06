export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  await req.arrayBuffer();
  return new Response('OK');
}