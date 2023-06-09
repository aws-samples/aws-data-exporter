export default {
  translation: {
    app: {
      name: "Data Exporter",
      authority: {
        readonly: "Read only",
        downloadable: "Downloadable",
      },
      sideMenu: {
        myPage: "MyPage",
        newReport: "New Report",
      },
      settings: {
        language: "Language",
        switchTheme: "Switch Theme",
        signOut: "Sign Out",
      },
      language: {
        en: "English",
        ja: "日本語",
      },
      field: {
        mailaddress: "email address",
        conditionOperator: "Condition",
      },
      button: {
        register: "Register",
        ok: "OK",
        cancel: "Cancel",
      },
      message: {
        loading: "Please wait...",
      },
      error: {
        downloadDenied: "You don't have permission to download.",
      },
      stringOperator: {
        eq: "equal to",
        neq: "NOT equal to",
        contains: "contains",
      },
      numberOperator: {
        eq: "=",
        neq: "≠",
        gt: ">",
        gte: "≧",
        lt: "<",
        lte: "≦",
      },
      selectLanguageDialog: {
        title: "Language Settings",
        label: "Language",
      },
    },
    myPage: {
      shareReportDialog: {
        title: "Share Report",
        description:
          "<div>Share [{{reportName}}] report. </div><div>Enter the email address to which you would like to share the report.</div>",
        button: {
          share: "Share",
        },
      },
      menu: {
        savedReport: "Saved Report",
        sharedReport: "Shared Report",
        extractionHistory: "Extraction History",
      },
      reportList: {
        message: {
          noSavedReport: "No Saved Report.",
          noSharedReport: "No Shared Report.",
          shareSuccess: "Shared the report with {{userName}}.",
        },
        button: {
          copy: "Copy",
          share: "Share",
        },
      },
      extractionHistory: {
        message: {
          noHistory: "No Extraction History.",
        },
        field: {
          tableName: "Table",
          extractedData: "Columns",
          extractedCondition: "Conditions",
          extractedDatetime: "Datetime",
        },
        stringOperator: {
          eq: {
            notEmpty: "is equal to <TextBlock>{{value}}</TextBlock>",
            empty: "is empty",
          },
          neq: {
            notEmpty: "is NOT equal to<TextBlock>{{value}}</TextBlock>",
            empty: "is NOT empty",
          },
          contains: "is contains <TextBlock>{{value}}</TextBlock>",
        },
        relativeDateOperator: {
          today: "is <TextBlock>today</TextBlock>",
          yesterday: "is <TextBlock>yesterday</TextBlock>",
          lastWeek: "is <TextBlock>last week</TextBlock>",
          lastMonth: "is <TextBlock>last month</TextBlock>",
          lastYear: "is <TextBlock>last year</TextBlock>",
        },
        relativeDateNOperator: {
          day_one: "from <TextBlock>{{value}}</TextBlock> day ago",
          day_other: "from <TextBlock>{{value}}</TextBlock> days ago",
          week_one: "from <TextBlock>{{value}}</TextBlock> week ago",
          week_other: "from <TextBlock>{{value}}</TextBlock> weeks ago",
          month_one: "from <TextBlock>{{value}}</TextBlock> month ago",
          month_other: "from <TextBlock>{{value}}</TextBlock> months ago",
          year_one: "from <TextBlock>{{value}}</TextBlock> year ago",
          year_other: "from <TextBlock>{{value}}</TextBlock> years ago",
        },
        absoluteDateOperator:
          "from <TextBlock>{{from}}</TextBlock> to <TextBlock>{{to}}</TextBlock> ",
      },
      button: {
        newReport: "New Report",
      },
    },
    reportPage: {
      field: {
        targetTable: "Table",
        reportName: "Report Name",
        unsavedReport: "[Unsaved Report]",
        extractResult: "Extract Result",
        columns: "Columns",
        selectColumns: "Select Columns",
        extractConditions: "Conditions",
        extractConditionValue: "Value",
        prefixCopiedReport: "[Copied]",
      },
      button: {
        gotoConditionPage: "back to condition page",
        saveReport: "Save Report",
        export: "Export",
        extract: "Extract",
        itemSort: "Sort",
      },
      message: {
        selectTable: "Please select a table.",
        selectMultipleColumnsNotice:
          "By holding down the Shift key and clicking on a column name, you can sort multiple columns.",
        succesSaveReport: "Saved the report.",
      },
      error: {
        requiredColumns: "Select columns is a required field.",
        requiredConditions: "Conditions is a required field.",
      },
      registerReportDialog: {
        title: "Save Report",
        description: "Save the report with the currently set conditions.",
      },
      dateConditions: {
        relative: "Relative",
        relativeN: "Relative (N value)",
        absolute: "Absolute",
        today: "Today",
        yesterday: "Yesterday",
        lastWeek: "Last Week",
        lastMonth: "Last Month",
        lastYear: "Last Year",
        dayBefore: "day ago",
        weekBefore: "week ago",
        monthBofore: "month ago",
        yearBefore: "year ago",
      },
    },
  },
};
