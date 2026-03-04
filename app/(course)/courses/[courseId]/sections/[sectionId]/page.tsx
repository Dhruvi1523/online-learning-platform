import SectionsDetails from "@/components/sections/SectionsDetails";
import { db } from "@/models";
import { auth } from "@clerk/nextjs/server";
import { Course, MuxData, Progress, Purchase, Resource, Section } from "@/lib/types";
import { redirect } from "next/navigation";

const toPlain = <T,>(value: unknown): T => {
  if (value && typeof value === "object" && "toJSON" in (value as Record<string, unknown>)) {
    const modelLike = value as { toJSON: () => T };
    return modelLike.toJSON();
  }
  return value as T;
};

const SectionDetailsPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; sectionId: string }>;
}) => {
  const { courseId, sectionId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findOne({
    where: {
      id: courseId,
      isPublished: true,
    },
    include: [
      {
        association: "sections",
        where: { isPublished: true },
        required: false,
      },
    ],
  });

  if (!course) {
    return redirect("/");
  }

  const sectionRecord = await db.section.findOne({
    where: {
      id: sectionId,
      courseId,
      isPublished: true,
    },
  });

  if (!sectionRecord) {
    return redirect(`/courses/${courseId}/overview`);
  }
  const section = toPlain<Section>(sectionRecord);

  const purchase = await db.purchase.findOne({
    where: {
      customerId: userId,
      courseId,
    },
  });

  let muxData = null;
  let resources: unknown[] = [];

  if (section.isFree || purchase) {
    muxData = await db.muxData.findOne({
      where: {
        sectionId,
      },
    });
  }

  if (purchase) {
    resources = (await db.resource.findAll({
      where: {
        sectionId,
      },
    })) as unknown[];
  }

  const progress = await db.progress.findOne({
    where: {
      studentId: userId,
      sectionId,
    },
  });

  const plainCourse = toPlain<Course & { sections: Section[] }>(course);
  const plainSection = section;
  const plainPurchase = purchase ? toPlain<Purchase>(purchase) : null;
  const plainMuxData = muxData ? toPlain<MuxData>(muxData) : null;
  const plainResources = resources.map((resource) => toPlain<Resource>(resource));
  const plainProgress = progress ? toPlain<Progress>(progress) : null;

  return (
    <SectionsDetails
      course={plainCourse}
      section={plainSection}
      purchase={plainPurchase}
      muxData={plainMuxData}
      resources={plainResources}
      progress={plainProgress}
    />
  );
};

export default SectionDetailsPage;
