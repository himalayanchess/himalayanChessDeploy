import { dbconnect } from "@/index";
import Payment from "@/models/PaymentModel";
import { NextRequest, NextResponse } from "next/server";

// Compare two installments
function isSameInstallment(a: any, b: any) {
  return (
    Number(a.amount) === Number(b.amount) &&
    new Date(a.paidDate).toISOString() === new Date(b.paidDate).toISOString() &&
    a.paymentMethod === b.paymentMethod &&
    a.paymentTitle === b.paymentTitle
  );
}

export async function PUT(req: NextRequest) {
  try {
    await dbconnect();

    const body = await req.json();
    const {
      paymentId,
      installments: newInstallments = [],
      updatedBy: userInfo,
      ...rest
    } = body;

    if (!paymentId) {
      return NextResponse.json({ statusCode: 400, msg: "Missing paymentId" });
    }

    const existingPayment = await Payment.findById(paymentId);
    if (!existingPayment) {
      return NextResponse.json({ statusCode: 404, msg: "Payment not found" });
    }

    const existingInstallments = existingPayment.installments || [];
    const finalInstallments: any[] = [];

    // Step 1: Mark matching installments as active, others as inactive
    for (const old of existingInstallments) {
      const found = newInstallments.some((n: any) => isSameInstallment(old, n));
      finalInstallments.push({
        ...old.toObject(),
        activeStatus: found,
      });
    }

    // Step 2: Add any new installments not already present
    for (const newInst of newInstallments) {
      const exists = existingInstallments.some((old: any) =>
        isSameInstallment(old, newInst)
      );
      if (!exists) {
        finalInstallments.push({
          ...newInst,
          activeStatus: true,
        });
      }
    }

    // Step 3: Calculate totals
    const totalPaid = finalInstallments
      .filter((i: any) => i.activeStatus)
      .reduce((sum, i) => sum + Number(i.amount || 0), 0);

    const totalAmount = Number(
      rest.totalAmount || existingPayment.totalAmount || 0
    );
    const remainingAmount = Math.max(totalAmount - totalPaid, 0);

    let paymentStatus = "Pending";
    if (totalPaid >= totalAmount) paymentStatus = "Paid";
    else if (totalPaid > 0) paymentStatus = "Partial";

    // Step 4: Prepare updatedBy log entry
    const updateEntry = {
      userName: userInfo?.name || "",
      userId: userInfo?._id || "",
      userRole: userInfo?.role || "",
      userBranch: userInfo?.branchName || "",
      updatedAt: new Date(),
      newInstallments: finalInstallments,
      paymentStatus,
      totalPaid,
      remainingAmount,
      totalAmount,
    };

    // Step 5: Update Payment document
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        ...rest,
        installments: finalInstallments,
        totalPaid,
        remainingAmount,
        paymentStatus,
        $push: { updatedBy: updateEntry },
      },
      { new: true }
    );

    return NextResponse.json({
      statusCode: 200,
      msg: "Payment updated successfully",
      updatedPayment,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({
      statusCode: 500,
      msg: "Internal server error",
      error: error instanceof Error ? error.message : error,
    });
  }
}
