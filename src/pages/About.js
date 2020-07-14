import React from 'react';
export const About = (props) => {
    return (
        <div>
            <div>
                {props.lang ==='cn' ? '免責聲明：所有資料由政府提供，請自行判斷資料真確性。如要查看csv及pdf數據，請瀏覽' : 'Disclaimer: All information is provided by the government, please judge the authenticity of the information yourself. To view csv and pdf data, please browse '}<a target="_blank" href="https://data.gov.hk/tc-data/dataset/hk-dh-chpsebcddr-novel-infectious-agent">{props.lang ==='cn' ? '政府資料一線通網站' : 'Gov Data API'}</a>
            </div>
            <div style={{marginTop: 20}}>
                {props.lang === 'cn' ? '此應用程式由Johnny Ho開發，如有任何疑問，請電郵' : 'This application is developed by Johnny Ho, if you have any questions, please email '}<a href="mailto:johnnyhohohohohoho@gmail.com">johnnyhohohohohoho@gmail.com</a>
            </div>
        </div>
    )
}