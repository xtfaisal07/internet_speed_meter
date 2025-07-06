export async function GET() {
  const buffer = Buffer.alloc(5 * 1024 * 1024); // 5MB
  return new Response(buffer);
}