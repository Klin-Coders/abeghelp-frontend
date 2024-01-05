import tickIcon from "@/public/assets/icons/campaign/tick-circle.svg";
import Image from "next/image";

const semanticClasses = {
  stepperIcon:
    "grid text-[1.2rem] font-bold shrink-0 text-white place-content-center aspect-square w-[2rem] bg-formBtn rounded-full",
};

function Stepper() {
  return (
    <section className="flex flex-col gap-[1.2rem]">
      <div className="flex items-center gap-[0.4rem]">
        <span className={semanticClasses.stepperIcon}>
          <Image src={tickIcon as string} alt="" width={12} height={12} />
        </span>

        <hr className="w-full [border:1px_dashed_rgb(0,128,128)]" />

        <span className={semanticClasses.stepperIcon}>2</span>

        <hr className="w-full [border:1px_dashed_rgb(0,128,128)]" />

        <span className={semanticClasses.stepperIcon}>3</span>
      </div>

      <div className="flex items-center justify-between gap-[3.2rem] text-[0.8rem] text-formBtn">
        <article className="w-full">
          <h5 className="text-[1rem] font-medium">Basic Info</h5>
          <p>Create a campaign to fund your passion or cause</p>
        </article>

        <article className="w-full">
          <h5 className="text-[1rem] font-medium">Funding</h5>
          <p>Share your funding goal and deadline</p>
        </article>

        <article className="w-full">
          <h5 className="text-[1rem] font-medium">Story</h5>
          <p>Your story matters, and this is where it begins</p>
        </article>
      </div>
    </section>
  );
}
export default Stepper;
