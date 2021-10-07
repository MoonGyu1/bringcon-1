import React from 'react';
import {Col} from 'antd';
import './Main.css';

function Footer() {
    return (
        <div id="body" style={{width: '100vw'}}>
            <div className="footer-info">
            <Col style={{float: 'left', marginRight: '178px'}}>
                <div className="col-1">
                    <div className="company-name">BRINGCON</div>
                    <div>대표자</div>
                    <div>개인정보보호책임자</div>
                    <div>이메일</div>
                    <div>전화번호</div>
                </div>
            </Col>
            <Col style={{marginRight: '221px', float: 'left'}}>
                <div className="col-2">
                    <div className="company-location">서울시 성북구 장월로 1마길 56<br/>
                        DAC 스타트업 인큐베이팅 센터
                    </div>
                    <div>남한솔</div>
                    <div>이성연</div>
                    <div>contact@no-on.info</div>
                    <div>010-8774-0290</div>
                </div>
            </Col>
            <Col style={{marginRight: '175px', float: 'left'}}>
                <div className="col-3">
                    <div>사업자 등록번호</div>
                    <div>통신판매업 신고번호</div>
                </div>
            </Col>
            <Col>
            <div className="col-4">
                    <div>811-29-00871</div>
                    <div>2021-서울성북-1613</div>
                </div>
            </Col>
            </div>
            <div className="info-links">
                <span style={{marginLeft: '20px'}}><a href="/board">공지사항</a></span>
                <span><a href="/law/use" target="_blank">이용약관</a></span>
                <span><a href="law/personal" target="_blank">개인정보처리방침</a></span>
            </div>
        </div>
    )
}

export default Footer;