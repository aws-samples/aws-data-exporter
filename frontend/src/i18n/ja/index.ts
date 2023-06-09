export default {
  translation: {
    app: {
      name: "Data Exporter",
      authority: {
        readonly: "閲覧権限",
        downloadable: "ダウンロード権限",
      },
      sideMenu: {
        myPage: "マイページ",
        newReport: "レポート新規作成",
      },
      settings: {
        language: "言語",
        switchTheme: "テーマ切替",
        signOut: "サインアウト",
      },
      language: {
        en: "English",
        ja: "日本語",
      },
      field: {
        mailaddress: "メールアドレス",
        conditionOperator: "条件",
      },
      button: {
        register: "登録",
        ok: "OK",
        cancel: "キャンセル",
      },
      message: {
        loading: "処理中です。少々お待ちください。",
      },
      error: {
        downloadDenied: "ダウンロード権限がありません。",
      },
      stringOperator: {
        eq: "次に一致",
        neq: "次に一致しない",
        contains: "次を含む",
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
        title: "言語切り替え",
        label: "Language",
      },
    },
    myPage: {
      shareReportDialog: {
        title: "レポート共有",
        description:
          "<div>レポート「{{reportName}}」を共有します。</div><div>共有先のメールアドレスを入力してください。</div>",
        button: {
          share: "共有",
        },
      },
      menu: {
        savedReport: "保存したレポート",
        sharedReport: "共有されたレポート",
        extractionHistory: "抽出履歴",
      },
      reportList: {
        message: {
          noSavedReport: "保存したレポートがありません。",
          noSharedReport: "共有されたレポートがありません。",
          shareSuccess: "{{userName}}さんにレポートを共有しました。",
        },
        button: {
          copy: "複製",
          share: "共有",
        },
      },
      extractionHistory: {
        message: {
          noHistory: "抽出履歴がありません。",
        },
        field: {
          tableName: "テーブル名",
          extractedData: "抽出したデータ",
          extractedCondition: "抽出条件",
          extractedDatetime: "実行日時",
        },
        stringOperator: {
          eq: {
            notEmpty: "が<TextBlock>{{value}}</TextBlock>と一致する",
            empty: "が未設定である",
          },
          neq: {
            notEmpty: "が<TextBlock>{{value}}</TextBlock>と一致しない",
            empty: "が設定されている",
          },
          contains: "が<TextBlock>{{value}}</TextBlock>を含む",
        },
        relativeDateOperator: {
          today: "が <TextBlock>本日</TextBlock>",
          yesterday: "が <TextBlock>昨日</TextBlock>",
          lastWeek: "が <TextBlock>先週</TextBlock>",
          lastMonth: "が <TextBlock>先月</TextBlock>",
          lastYear: "が <TextBlock>昨年</TextBlock>",
        },
        relativeDateNOperator: {
          day: "が <TextBlock>{{value}}</TextBlock> 日前",
          week: "が <TextBlock>{{value}}</TextBlock> 週間前",
          month: "が <TextBlock>{{value}}</TextBlock> ヶ月前",
          year: "が <TextBlock>{{value}}</TextBlock> 年前",
        },
        absoluteDateOperator:
          "<TextBlock>{{from}}</TextBlock> 〜 <TextBlock>{{to}}</TextBlock> ",
      },
      button: {
        newReport: "レポート新規作成",
      },
    },
    reportPage: {
      field: {
        targetTable: "対象テーブル",
        reportName: "レポート名",
        unsavedReport: "保存されていないレポート",
        extractResult: "抽出結果",
        columns: "データ一覧",
        selectColumns: "抽出したいデータ",
        extractConditions: "抽出条件",
        extractConditionValue: "条件値",
        prefixCopiedReport: "[複製]",
      },
      button: {
        gotoConditionPage: "条件設定画面へ",
        saveReport: "レポートを保存",
        export: "エクスポート",
        extract: "抽出実行",
        itemSort: "並び替え",
      },
      message: {
        selectTable: "テーブルを選択してください",
        selectMultipleColumnsNotice:
          "Shitfキーを押しながら列名をクリックすることで、複数の列を同時に並び替えできます。",
        succesSaveReport: "レポートを保存しました。",
      },
      error: {
        requiredColumns: "抽出したいデータを1件以上追加してください。",
        requiredConditions: "抽出条件を1件以上追加してください。",
      },
      registerReportDialog: {
        title: "レポート保存",
        description: "現在設定されている条件でレポートを保存します。",
      },
      dateConditions: {
        relative: "相対指定",
        relativeN: "相対指定(N値指定)",
        absolute: "絶対指定",
        today: "今日",
        yesterday: "昨日",
        lastWeek: "先週",
        lastMonth: "先月",
        lastYear: "昨年",
        dayBefore: "日前",
        weekBefore: "週前",
        monthBofore: "ヶ月前",
        yearBefore: "年前",
      },
    },
  },
};
