const createPDFNotice2 = async () => {
  try {
    const student_address = addressOBJ[0];
    const student_details = studentOBJ[0];
    const male = student_details.gender == "ذكر" ? true : false;
    let options = {
      html: `<body  lang="ar" dir="rtl" style="line-height: 1.8;">
    <h2 style="text-align: center;">الجمهورية الجزائرية الديمقراطية الشعبية <br>
      وزارة التربية الوطنية</h2>
      <h3>مديرية التربية لولاية ${school?.school_wilaya}<br>
      ثانوية : ${school?.school_name} -${school?.school_baladiya}- <br> 
      الرقم : ............... /${sendDate.getFullYear()}</h3>
      <div style=" position: absolute; margin: -130px 470px 0 0;">
        <h3 style="text-align: left;">السنة الدراسية : ${
          school?.academic_year
        }</h3>
    </div>
    
    <div style="position: absolute; margin: -80px 470px 200px 0;">
      <h3 style="text-align: center;">إلـى السيـد(ة): <br>
        ${
          student_address?.father_name
            ? student_address?.last_name + " " + student_address?.father_name
            : "....................................."
        } <br>
        العنوان: ${
          student_address?.address
            ? student_address?.address
            : ".........................."
        }</h3>
    </div>
    
    <h2 style="margin-top: 100px; padding: 0; margin-bottom: 5px;"> الموضــوع: الإشعـار الثاني بالغيـاب
    </h2>
    <br>
    <h3 style="margin: 0;"> المرجع:- الإشعـار الأول بالغيـاب بتاريخ : ${fisrtNoticeDate}. رقم:  ........
    </h3>    
    <h4 style="margin-top: 30px;">بنــاءً على القـرار الوزاري رقـم: 833 والمـؤرخ فـي: 13/11/1991 والمتعلـق بمواظبـة التلاميـذ <br>
      فـي المؤسسـات التعليميـة ولاسيمـا المـادة: 21 منـه ، و بنــاء على الاشعار الأول المشار إليه <br>
      في المرجع أعلاه <br>
      يؤسفنـي أن أنهــي إلـى علمكــم بـأن ${male ? "ابنكم" : "ابنتكم"}: ${
        student_address.last_name + " " + student_address.first_name
      } <br>
      ${
        male ? "المولود" : "المولودة"
      } بتاريـخ:  ${student_address.date_of_birth.toLocaleDateString(
        "ar-DZ"
      )}<br>   القســـــم: ${student_details.level} ${
        student_details.class_name
      } ${student_details.class_number} <br>
       قـد ${male ? "تغيب" : "تغيبت"}  عـن الدراسـة منـذ:   ${
        absenceDate
          ? startDate1.toLocaleDateString("ar-DZ")
          : startDate.toLocaleDateString("ar-DZ")
      }   إلـى غايـة يومنـا هـذا.  <br>
      <h3 style="font-weight: bold">
      لـذا نطلـب منكـم الحضـور إلـى المؤسسـة لتبريـر الغيـاب فـور استلامكـم هـذا الإشعـار.
    </h3>
    <br>
    </h3>
    <div>
      <h3 style="margin-right: 350px;"> حرر في: ${
        school?.school_baladiya
      }  بتاريخ:    ${sendDate.toLocaleDateString("ar-DZ")}<br>
      المديــــر(ة) <br>
    </div>
    
    
    </body>`,
      fileName: `${student_address.last_name}-${student_address.first_name}-2`,
      directory: "Documents",
      height: 842,
      width: 595,
    };

    let file = await RNHTMLtoPDF.convert(options);
    await android.actionViewIntent(file.filePath, "application/pdf");
  } catch (error) {
    <AlertError error={error} />;
  }
};
