export function getFinalUpdatedBatches(dbBatches: any[], passedBatches: any[]) {
  let finalUpdatedBatches = JSON.parse(JSON.stringify(dbBatches || []));

  passedBatches.forEach((passedBatch) => {
    const index = finalUpdatedBatches.findIndex(
      (batch: any) => batch.batchId === passedBatch.batchId
    );

    if (index !== -1) {
      // Update batch, ensure activeStatus is set to true
      finalUpdatedBatches[index] = { ...passedBatch, activeStatus: true };
    } else {
      // Add new batch, ensure activeStatus is set to true
      finalUpdatedBatches.push({ ...passedBatch, activeStatus: true });
    }
  });

  finalUpdatedBatches = finalUpdatedBatches.map((batch: any) => {
    const existsInPassed = passedBatches.some(
      (passedBatch) => passedBatch.batchId === batch.batchId
    );
    return existsInPassed ? batch : { ...batch, activeStatus: false };
  });

  return finalUpdatedBatches;
}

export function getFinalUpdatedEnrolledCourses(
  dbCourses: any[],
  passedCourses: any[]
) {
  let finalUpdatedEnrolledCourses = JSON.parse(JSON.stringify(dbCourses || []));

  passedCourses.forEach((passedCourse) => {
    const index = finalUpdatedEnrolledCourses.findIndex(
      (course: any) => course.courseId === passedCourse.courseId
    );

    if (index !== -1) {
      // Update course, ensure activeStatus is set to true
      finalUpdatedEnrolledCourses[index] = {
        ...passedCourse,
        activeStatus: true,
      };
    } else {
      // Add new course, ensure activeStatus is set to true
      finalUpdatedEnrolledCourses.push({ ...passedCourse, activeStatus: true });
    }
  });

  finalUpdatedEnrolledCourses = finalUpdatedEnrolledCourses.map(
    (course: any) => {
      const existsInPassed = passedCourses.some(
        (passedCourse) => passedCourse.courseId === course.courseId
      );
      return existsInPassed ? course : { ...course, activeStatus: false };
    }
  );

  return finalUpdatedEnrolledCourses;
}

export function getFinalUpdatedChapters(
  dbChapters: any[],
  passedChapters: any[]
) {
  let finalUpdatedChapters = JSON.parse(JSON.stringify(dbChapters || []));

  passedChapters.forEach((passedChapter) => {
    const index = finalUpdatedChapters.findIndex(
      (chapter: any) =>
        chapter.chapterName.toLowerCase() ===
        passedChapter.chapterName.toLowerCase()
    );

    if (index !== -1) {
      // Update chapter, ensure activeStatus is set to true
      finalUpdatedChapters[index] = { ...passedChapter, activeStatus: true };
    } else {
      // Add new chapter, ensure activeStatus is set to true
      finalUpdatedChapters.push({ ...passedChapter, activeStatus: true });
    }
  });

  finalUpdatedChapters = finalUpdatedChapters.map((chapter: any) => {
    const existsInPassed = passedChapters.some(
      (passedChapter) =>
        passedChapter.chapterName.toLowerCase() ===
        chapter.chapterName.toLowerCase()
    );
    return existsInPassed ? chapter : { ...chapter, activeStatus: false };
  });

  return finalUpdatedChapters;
}
