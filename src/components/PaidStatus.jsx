function PaidStatus({ type = "draft" }) {
  const classNames = {
    paid: ["text-[#33D69F] bg-[#33d69f0f]", "bg-[#33D69F]"],
    pending: ["text-[#FF8F00] bg-[#ff8f000f]", "bg-[#FF8F00]"],
    draft: ["text-[#373B53] bg-[#dfe3fa0f]", "bg-[#373B53]"],
  };

  const [textStyle, dotStyle] = classNames[type] || classNames.paid;

  return (
    <div
      className={`${textStyle} flex justify-center space-x-2 rounded-lg items-center px-4 py-2`}
    >
      <div className={`h-3 w-3 rounded-full ${dotStyle}`} />
      <p className="capitalize">{type}</p>
    </div>
  );
}

export default PaidStatus;