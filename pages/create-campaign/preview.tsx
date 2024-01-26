import Button from "@/components/primitives/Button/button";
import { useElementList } from "@/lib/hooks/useElementList";
import moneyIcon from "@/public/assets/icons/campaign/money.svg";
import { useFormStore } from "@/store/useformStore";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

function Preview() {
  const { stepOneData, stepTwoData, stepThreeData } = useFormStore(
    (state) => state,
  );

  const { For: ImageFileList } = useElementList();
  const { For: TagList } = useElementList();

  const imageUrls = stepThreeData.campaignImageFiles.map((file) =>
    URL.createObjectURL(file),
  );

  return (
    <>
      <header className="mt-3.2 flex flex-col gap-0.8 px-2.4">
        <h1 className="font-semibold text-formBtn">Campaign Preview</h1>

        <p className="text-1.4 text-formBtn">
          This is what your fundraiser campaign will look like to donors
        </p>
      </header>

      <main
        className="bg-contours bg-cover px-2.4 pb-6.2 pt-3.2 text-successText"
        data-rem-reset
      >
        <section>
          <h2 className="text-2 font-bold">{stepTwoData.campaignTitle}</h2>
          <Image
            src={imageUrls[0] ?? "/"}
            alt="campaign cover image"
            className="mt-0.8 w-full rounded-8"
            width={342}
            height={200}
          />

          <article className="gap-2.8 mt-0.8 flex flex-col px-2.4 py-3">
            <div>
              <p>₦{stepTwoData.campaignGoal} goal</p>
              <span className="mt-0.8 block h-[0.6rem] rounded-8 bg-semiWhite" />
            </div>
            <div className="flex flex-col gap-1.6">
              <Button
                variant="primary"
                className="w-full rounded-6 bg-formBtn px-2.4 py-1.2 text-1.2 font-bold"
              >
                Donate to this campaign
              </Button>
              <Button
                variant="secondary"
                className="w-full rounded-6 border-formBtn px-2.4 py-1.2 text-1.2 font-bold text-formBtn"
              >
                Share this campaign
              </Button>
            </div>

            <div className="flex items-start gap-8 text-1.2">
              <Image
                className="mt-0.4"
                src={moneyIcon as string}
                alt="money-icon"
                width={20}
                height={20}
              />
              <p>
                Be the first to donate to this fundraiser, every penny donated
                will go a long way
              </p>
            </div>

            <div className="flex gap-0.8 text-1.2">
              <Image
                src={"/"}
                className="rounded-full"
                alt="person-icon"
                width={20}
                height={20}
              />
              <p>
                {stepTwoData.fundraiserTarget ?? "Anonymous"} is in charge of
                this fundraiser.
              </p>
            </div>
          </article>
        </section>

        <section className="mt-0.8">
          <h2 className="flex gap-1.6 border-b border-b-placeholder p-0.8 font-bold">
            Category:
            <span className="font-normal">
              {stepOneData.fundraiserCategory}
            </span>
          </h2>

          <h3 className="mt-1.2 border-b border-b-placeholder p-0.8 font-bold">
            Story
          </h3>

          <div
            className="mt-2.4"
            dangerouslySetInnerHTML={{
              __html: stepThreeData.campaignStoryHtml,
            }}
          />
        </section>

        <section className="mt-2.4 flex flex-col gap-2.4 pb-1.6">
          <h2 className="font-bold">See more pictures below:</h2>
          <div className="flex flex-col items-center gap-2.3">
            <ImageFileList
              each={imageUrls.slice(1)}
              render={(url) => (
                <Image
                  className="h-[20rem] w-[25rem] rounded-6 object-cover"
                  src={url ?? "/"}
                  alt="extra campaign images"
                  width={250}
                  height={200}
                />
              )}
            />
          </div>

          <p>
            Campaign closes on:{" "}
            {format(stepTwoData.campaignDeadline, "dd-MM-yyyy")}.
          </p>

          <ul className="grid grid-cols-2 justify-items-center gap-x-0 gap-y-2.4 font-medium">
            <TagList
              each={stepOneData.campaignTags}
              render={(tag) => <li>#{tag}</li>}
            />
          </ul>
        </section>

        <section className="mt-3.2 flex items-start gap-1.6">
          <Image
            src={"/"}
            className="rounded-full"
            alt="person-icon"
            width={48}
            height={48}
          />

          <div>
            <p>
              {stepTwoData.fundraiserTarget || "Anonymous"} is in charge of this
              fundraiser.
              <span className="mt-8">{stepOneData.country}</span>
            </p>

            <Button
              variant="secondary"
              className="mt-2.4 rounded-6 border-formBtn px-1.6 py-1.2 text-1.4 font-bold text-formBtn"
            >
              Reach out
            </Button>
          </div>
        </section>
      </main>

      <footer className="flex justify-end gap-0.8 border-t border-t-formBtn px-2.4 py-1.6">
        <Button
          variant="secondary"
          className="rounded-6  border-formBtn px-1.2 py-0.8 text-1.2 font-bold text-formBtn"
        >
          <Link href={"/create-campaign"}>Edit campaign</Link>
        </Button>

        <Button
          variant="primary"
          className="rounded-6 bg-formBtn px-1.2 py-0.8 text-1.2 font-bold"
        >
          Create Campaign
        </Button>
      </footer>
    </>
  );
}

export default Preview;
