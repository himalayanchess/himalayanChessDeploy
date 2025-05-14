let passedBatches = [
  {
    batchId: "67cdc2ca306e919f3e14217e",
    batchName: "HCA_SAT(9-10)",
    startDate: "2025-02-24T00:00:00.000Z",
    endDate: "2025-03-12",
    activeStatus: true,
    _id: "67cfe00b68b62cb804c691a2",
  },
  {
    batchId: "67cdc2da306e919f3e142181",
    batchName: "HCA_SAT(10-11)",
    startDate: "2025-03-06",
    endDate: "",
    activeStatus: true,
  },
];

let dbStudents = [
  {
    batchId: "67cdc2ca306e919f3e14217e",
    batchName: "HCA_SAT(9-10)",
    endDate: null,
    activeStatus: true,
    _id: "67cfe00b68b62cb804c691a2",
  },
  {
    batchId: "67abc123456e919f3e1421ff",
    batchName: "Old_Batch(8-9)",
    endDate: null,
    activeStatus: true,
  },
];

let finalBatches = [...dbStudents]; // Start with existing dbStudents

// Update existing records and add new ones
passedBatches.forEach((passedBatch) => {
  const index = finalBatches.findIndex(
    (student) => student.batchId === passedBatch.batchId
  );

  if (index !== -1) {
    // If batch exists, update it
    finalBatches[index] = passedBatch;
  } else {
    // If batch does not exist, add it
    finalBatches.push(passedBatch);
  }
});

// Mark inactive batches (present in dbStudents but not in passedBatches)
finalBatches = finalBatches.map((batch) => {
  const existsInPassed = passedBatches.some(
    (passedBatch) => passedBatch.batchId === batch.batchId
  );
  if (!existsInPassed) {
    return { ...batch, activeStatus: false };
  }
  return batch;
});
