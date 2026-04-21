export default function BlobBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full
                      bg-lavender-300 opacity-55 blur-3xl animate-drift" />
      <div className="absolute top-[40%] -right-32 w-[480px] h-[480px] rounded-full
                      bg-blush-200 opacity-55 blur-3xl animate-drift"
           style={{ animationDelay: "-7s" }} />
      <div className="absolute -bottom-40 left-1/3 w-[420px] h-[420px] rounded-full
                      bg-nude-200 opacity-55 blur-3xl animate-drift"
           style={{ animationDelay: "-14s" }} />
    </div>
  );
}
