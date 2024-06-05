<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Simple Point Filter</se:Name>
    <UserStyle>
      <se:Name>Simple Point Filter</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Small populated New Yorks</se:Name>
          <Filter xmlns="http://www.opengis.net/ogc">
            <And>
              <PropertyIsEqualTo>
                <PropertyName>NAME</PropertyName>
                <Literal>New York</Literal>
              </PropertyIsEqualTo>
              <PropertyIsEqualTo>
                <PropertyName>TEST_BOOL</PropertyName>
                <Literal>true</Literal>
              </PropertyIsEqualTo>
              <PropertyIsNull>
                <PropertyName>TEST</PropertyName>
              </PropertyIsNull>
              <PropertyIsLike wildCard="*" singleChar="." escapeChar="!">
                <PropertyName>TEST2</PropertyName>
                <Literal>*York*</Literal>
              </PropertyIsLike>
              <PropertyIsLike wildCard="*" singleChar="." escapeChar="!">
                <PropertyName>TEST1</PropertyName>
                <Literal>*New*</Literal>
              </PropertyIsLike>
              <Not>
                <PropertyIsGreaterThan>
                  <PropertyName>POPULATION</PropertyName>
                  <Literal>100000</Literal>
                </PropertyIsGreaterThan>
              </Not>
              <Or>
                <PropertyIsEqualTo>
                  <PropertyName>TEST2</PropertyName>
                  <Literal>1</Literal>
                </PropertyIsEqualTo>
                <PropertyIsEqualTo>
                  <PropertyName>TEST2</PropertyName>
                  <Literal>2</Literal>
                </PropertyIsEqualTo>
              </Or>
              <PropertyIsBetween>
                <PropertyName>TEST3</PropertyName>
                <LowerBoundary>
                  <Literal>1</Literal>
                </LowerBoundary>
                <UpperBoundary>
                  <Literal>5</Literal>
                </UpperBoundary>
              </PropertyIsBetween>
            </And>
          </Filter>
          <se:MinScaleDenominator>10000</se:MinScaleDenominator>
          <se:MaxScaleDenominator>20000</se:MaxScaleDenominator>
          <se:PointSymbolizer uom="http://www.opengeospatial.org/se/units/pixel">
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
