<div className="space-y-4 h-full flex flex-col  overflow-y-auto">
        <div className="grid grid-cols-3 gap-5 overflow-y-auto">
          <div className="">
            <p className="font-bold text-xs text-gray-500">Date:</p>
            <p>
              {dayjs(activityRecord?.nepaliDate)
                .tz(timeZone)
                .format("MMMM D, YYYY, dddd")}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">
              Trainer Present Status:
            </p>
            <p
              className={`text-xs text-white w-max font-bold rounded-full px-2 py-1 ${
                activityRecord?.userPresentStatus?.toLowerCase() === "present"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            >
              {activityRecord.userPresentStatus}
            </p>
          </div>
          {/* empty cell */}
          <div className="emptycell"></div>
          <div>
            <p className="font-bold text-xs text-gray-500">Trainer Name:</p>
            <Link
              href={`/${session?.data?.user?.role?.toLowerCase()}/users/${
                activityRecord?.trainerId
              }`}
              className="underline hover:text-blue-600"
            >
              <p>{activityRecord.trainerName}</p>
            </Link>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Course Name:</p>
            <p>{activityRecord.courseName}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Study Topic</p>
            {/* <p>{activityRecord.courseName}</p> */}
            my study topic Lorem ipsum
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Affiliated To:</p>
            <p>{activityRecord.affiliatedTo || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Batch Name:</p>
            <p>{activityRecord.batchName}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Project Name:</p>
            <p>{activityRecord.projectName || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Week Start Date:</p>
            <p>
              {dayjs(activityRecord?.weekStartDate)
                .tz(timeZone)
                .format("MMMM D, YYYY, dddd")}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Week End Date:</p>
            <p>
              {" "}
              {dayjs(activityRecord?.weekEndDate)
                .tz(timeZone)
                .format("MMMM D, YYYY, dddd")}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Week Number:</p>
            <p>#{activityRecord.weekNumber || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Start Time:</p>
            <p>
              {dayjs(activityRecord?.startTime).tz(timeZone).format("hh:mm A")}
            </p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">End Time:</p>
            {dayjs(activityRecord?.startTime).tz(timeZone).format("hh:mm A")}
          </div>
          {/* empty */}
          <div className="emptycell"></div>

          <div>
            <p className="font-bold text-xs text-gray-500">Arrival Time:</p>
            <p>{activityRecord.arrivalTime || "N/A"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">Departure Time:</p>
            <p>{activityRecord.departureTime || "N/A"}</p>
          </div>
          {/* empty */}
          <div className="emptycell"></div>
          <div>
            <p className="font-bold text-xs text-gray-500">Holiday Status:</p>
            <p>{activityRecord.holidayStatus ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="font-bold text-xs text-gray-500">
              Holiday Description:
            </p>
            <p>{activityRecord.holidayDescription || "N/A"}</p>
          </div>

          {/* empty cell */}
          <div className="emptycell"></div>
          {/* student activity Records */}
          <div className="col-span-3">
            <p className="font-bold text-xs text-gray-500">
              Student activityRecords:
            </p>
            {activityRecord?.studentRecords?.length == 0 ? (
              <p className="text-sm">Record not available</p>
            ) : (
              <StudentRecordComponent
                studentRecords={activityRecord?.studentRecords}
              />
            )}
          </div>

          <div className="col-span-3 mt-2">
            <p className="font-bold text-xs text-gray-500">Study Materials:</p>
            {activityRecord?.studyMaterials?.length == 0 ? (
              <p className="text-sm">Study materials not available</p>
            ) : (
              <div className="mt-3 w-full">
                <StudyMaterialListComponent
                  studyMaterials={activityRecord?.studyMaterials}
                />
              </div>
            )}
          </div>
        </div>
      </div>