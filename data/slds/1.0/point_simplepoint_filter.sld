<?xml version="1.0" encoding="ISO-8859-1"?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Simple Point Filter</Name>
    <UserStyle>
      <Title>Simple Point Filter</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Small populated New Yorks</Name>
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
              <ogc:PropertyIsLike wildCard="*" singleChar="." escape="!">
                <ogc:PropertyName>TEST2</ogc:PropertyName>
                <ogc:Literal>*York*</ogc:Literal>
              </ogc:PropertyIsLike>
              <ogc:PropertyIsLike wildCard="*" singleChar="." escape="!">
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
          <MinScaleDenominator>10000</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF0000</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>6</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
