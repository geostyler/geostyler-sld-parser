<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Simple Point Filter</se:Name>
    <UserStyle>
      <se:Name>Simple Point Filter</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Small populated New Yorks</se:Name>
          <ogc:Filter xmlns="http://www.opengis.net/ogc">
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>NAME</ogc:PropertyName>
                <ogc:Literal>New York</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>TEST_BOOL</ogc:PropertyName>
                <ogc:Literal>true</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:PropertyIsNull>
                <ogc:PropertyName>TEST</ogc:PropertyName>
              </ogc:PropertyIsNull>
              <ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!">
                <ogc:PropertyName>TEST2</ogc:PropertyName>
                <ogc:Literal>*York*</ogc:Literal>
              </ogc:PropertyIsLike>
              <ogc:PropertyIsLike wildCard="*" singleChar="." escapeChar="!">
                <ogc:PropertyName>TEST1</ogc:PropertyName>
                <ogc:Literal>*New*</ogc:Literal>
              </ogc:PropertyIsLike>
              <ogc:Not>
                <ogc:PropertyIsGreaterThan>
                  <ogc:PropertyName>POPULATION</ogc:PropertyName>
                  <ogc:Literal>100000</ogc:Literal>
                </ogc:PropertyIsGreaterThan>
              </ogc:Not>
              <ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>TEST2</ogc:PropertyName>
                  <ogc:Literal>1</ogc:Literal>
                </ogc:PropertyIsEqualTo>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>TEST2</ogc:PropertyName>
                  <ogc:Literal>2</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
              <ogc:PropertyIsBetween>
                <ogc:PropertyName>TEST3</ogc:PropertyName>
                <LowerBoundary>
                  <ogc:Literal>1</ogc:Literal>
                </LowerBoundary>
                <UpperBoundary>
                  <ogc:Literal>5</ogc:Literal>
                </UpperBoundary>
              </ogc:PropertyIsBetween>
            </ogc:And>
          </ogc:Filter>
          <se:MinScaleDenominator>10000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>20000</se:MaxScaleDenominator>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>circle</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#FF0000</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                  <se:SvgParameter name="stroke-width">2</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Size>6</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
