export default function Loading({ height }: { height?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${height ? height : "h-screen"} w-full`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
